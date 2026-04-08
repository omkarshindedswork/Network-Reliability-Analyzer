# Fuzzy Logic Link Reliability Simulator: Concept & Implementation

## Brief Explanation
“This project is a web-based simulator that estimates the reliability of a communication link such as a Wi-Fi or internet connection using fuzzy logic.
In real life, parameters like signal strength, noise, and traffic load are uncertain and cannot be defined precisely.
So instead of hard mathematical formulas, we use fuzzy logic to model human-like decision making.
The user provides these parameters using sliders, and the system applies fuzzy rules to estimate the link reliability as Poor, Average, Good, or Excellent.
The focus is on soft computing–based decision making, not on physical network simulation. The complete system is deployed as a web application for easy evaluation.”

## 1. Introduction to the Soft Computing Approach

Rather than simulating discrete packet sequences, bit-error rates, or exact RF signal fading, this simulation dynamically models abstract link health through a **Mamdani-style fuzzy inference system**. 
This soft computing approach is incredibly valuable in network management because network degradation parameters are often non-linear, subjective, and codependent. Using rigorous mathematical membership models combined with English-like cognitive rules, the simulation gracefully processes ambiguity. Ultimately, it distills three complex variables down into one deterministic, continuous percentage representing human-centric connectivity quality.

## 2. Fuzzification (Crisp to Fuzzy Mapping)

The engine's initial step—Fuzzification—translates absolute numerical metrics (crisp inputs) into degrees of inclusion within categorical, linguistic subsets.

### 2.1 The Input Domain and Internal Normalization
The system evaluates three defining physical metrics. For computational elegance within the logic engine, ranges are normalized internally on a strict `[0.0, 1.0]` axis:
- **Signal Strength:** Evaluated on a spectrum from -90 dBm (barely detectable) to -30 dBm (perfectly clean). This metric maps to the subsets *Weak, Medium, Strong*.
- **Noise Level (Interference):** Evaluated between 0 dB (theoretical silence) and 60 dB (destructive interference). This maps to *Low, Medium, High*.
- **Traffic Load (Congestion):** Tracked from 0% (idle) to 100% (saturated). This maps to *Low, Medium, High*.

### 2.2 Mathematical Membership Functions
Categorization is not a hard "boolean" cut-off (e.g., Signal is NOT simply Weak if < -70 and Medium if > -70). Instead, the system applies distinct continuous functions that return a partial membership decimal between $0.0$ and $1.0$:
- **Trapezoidal Memberships (`trapMF`):** 
  Employed for the ultimate extreme boundaries, like "Weak" signals or "High" traffic. A trapezoidal function features a "plateau" or flat-top—meaning if a value passes an upper threshold, the membership hits exactly $1.0$ and stays there. As the value improves toward the middle range, the membership smoothly linearly decays to $0.0$.
- **Triangular Memberships (`triangularMF`):** 
  Employed for specific intermediate states, such as "Medium" signal or "Medium" noise. This geometry spikes to $1.0$ precisely at a specific "perfect middle" coordinate, and identically drops off back to zero on both the lower and higher sides, creating a strict, overlapping transitional zone.

To maximize sensitivity and ensure smooth, reactive gradients (avoiding mathematical "dead zones" where results saturate), these functions act as **Partitions of Unity**. The overlapping edges are perfectly symmetrical—as one membership linearly falls from $1.0$, its neighbor identically rises, verifying that their combined total always equals precisely $1.0$.

## 3. Fuzzy Logic Inference (The Rule Base)

Once all inputs are cleanly mapped into decimal memberships across their overlapping sub-categories, the engine consults its programmed logic. 

### 3.1 Cognitive Rule Evaluation
The simulator is driven by a highly structured, scientifically exhaustive matrix of **27 overlapping IF-THEN rules**—covering every single $3 \times 3 \times 3$ permutation of inputs—designed to emulate an engineer's common sense when assessing a network map. 
For example: *IF Signal is Strong AND Noise is Low AND Traffic is Low, THEN Outcome is Excellent*.
Another rule: *IF Signal is Medium AND Noise is High AND Traffic is Medium, THEN Outcome is Average*.

By rigorously plotting all 27 combinations—rather than utilizing a sparse subset—the simulator exhibits maximal sensitivity, mathematically reacting organically to even minute 1% slider adjustments across every conceivable edge-case without "freezing" or "saturating" in undefined zones.

### 3.2 Mamdani Min-AND Intersection
For multi-antecedent rules (rules with multiple "AND" conditions), establishing the explicit activation strength of that rule requires processing all conditions simultaneously.
To strictly enforce standard logic intersection in fuzzy geometry, the simulation runs a "minimum" boundary operation (`Math.min()`). 
If a scenario states that the Signal is 0.9 memberships Strong, Noise is 0.6 memberships Low, and Traffic is only 0.3 memberships Low, the overall rule strength is restricted by the lowest denominator. Therefore, the rule fires with an explicit strength of 0.3. Every one of the 27 rules is assessed against the current state, and all rules outputting a strength above 0.001 proceed to aggregation.

## 4. Defuzzification (Fuzzy to Crisp Aggregation)

Because network states blur boundaries (e.g., 0.5 Medium and 0.5 Strong signal), multiple overlapping rules will trigger at the exact same moment. 
One rule may argue for "Average" reliability while another simultaneously argues for "Good". 

### 4.1 Centre of Gravity for Singletons (Weighted Average Solution)
To resolve this mathematically, the engine maps every possible linguistic consequent (Poor, Average, Good, Excellent) onto a fixed numerical scale (0 to 100).
- **Excellent:** Weighted anchor point centered at $87.5$
- **Good:** Multiple anchor variations spanning $63.0$ to $72.0$
- **Average:** Anchors ranging between $38.0$ and $50.0$
- **Poor:** Anchors clustered around $10.0$ to $28.0$

Defuzzification proceeds using a strict weighted average format. The engine cross-multiplies every specific fired rule's specific outcome anchor by its computed activation strength. Finally, by dividing that summed dividend by the sum of all individual activation weights, the engine reliably returns a single, normalized, continuous float value (e.g., 68.4). 

## 5. Visual Post-Processing and Output Categorization

The final Defuzzified scalar (0 to 100) is bounded directly by the JavaScript math clamps to preserve metric integrity. 
To serve the user interface clearly, this pure mathematical output is systematically bucketed sequentially into pure, distinct, static semantic blocks:
1. **0% - 25%:** Assessed purely as a **Poor** connection.
2. **26% - 50%:** Assessed purely as an **Average** connection.
3. **51% - 75%:** Assessed purely as a **Good** connection. 
4. **76% - 100%:** Assessed purely as an **Excellent** connection. 

This completes the pipeline—transforming extremely nuanced and complex overlapping data environments precisely into a clean, actionable visual rating scale for non-technical evaluation.
