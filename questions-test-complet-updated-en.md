# Rationality Test - Complete Questions (Updated Version)

**Version:** full
**Total Points:** 96.98
**Estimated Time:** 86 minutes

---

## Probabilistic Reasoning (13 items)

**Points:** 13 | **Time:** 5 min

### Question 1 (ID: prob-match-1)

**Type:** Multiple Choice

**Question:**

A deck of cards contains 60% red cards and 40% blue cards. You must predict the color before each draw (with replacement). Over 100 draws, which strategy will give you the HIGHEST number of correct predictions?

**Options:**

a. Always predict red
b. Predict red 60 times and blue 40 times
c. Alternate between red and blue equally

**Correct Answer:** a

**Explanation:**

Always predicting red gives 60% success (60/100 correct). Predicting red 60 times and blue 40 times gives only ~52% success on average. The 'probability matching' error is reproducing the proportions instead of always choosing the most probable option.

**Points:** 1

---

### Question 2 (ID: prob-match-2)

**Type:** Multiple Choice

**Question:**

A machine produces defective parts 30% of the time and good parts 70% of the time. To guess the state of the next part, which strategy is best?

**Options:**

a. Always guess 'good part'
b. Guess 'defective' 3 times out of 10 and 'good' 7 times out of 10
c. Alternate randomly

**Correct Answer:** a

**Explanation:**

Always guessing the most probable option (70%) is optimal. Trying to 'match' the probabilities reduces your success rate.

**Points:** 1

---

### Question 3 (ID: gambler-1)

**Type:** Multiple Choice

**Question:**

A fair coin (50-50 heads or tails) has just landed on heads five times in a row. For the sixth toss:

**Options:**

a. Tails is more likely to come up
b. Heads is more likely to come up
c. Heads and tails are equally likely

**Correct Answer:** c

**Explanation:**

The tosses are independent. The coin has no memory. P(heads) = P(tails) = 50% on each toss, regardless of history.

**Points:** 1

---

### Question 4 (ID: gambler-2)

**Type:** Multiple Choice

**Question:**

At roulette, red has come up 7 times in a row. Which color is most likely to come up on the next spin?

**Options:**

a. Red
b. Black
c. Both have the same chances

**Correct Answer:** c

**Explanation:**

Each spin is independent. Past results do not influence future spins. This is the 'gambler's fallacy' error.

**Points:** 1

---

### Question 5 (ID: gambler-3)

**Type:** Multiple Choice

**Question:**

You roll a fair die. It lands on 6 three consecutive times. On the fourth roll, which face has the highest probability of coming up?

**Options:**

a. A number other than 6
b. 6 again
c. All faces have the same probability (1/6)

**Correct Answer:** c

**Explanation:**

The die has no memory. Each roll is independent. All faces have exactly 1/6 chance each time.

**Points:** 1

---

### Question 6 (ID: gambler-4)

**Type:** Multiple Choice

**Question:**

A couple has 4 daughters. They want a fifth child. What is the probability that it will be a boy?

**Options:**

a. More than 50% (they are 'due' for a boy)
b. Less than 50% (they tend to have girls)
c. About 50% (independent of previous births)

**Correct Answer:** c

**Explanation:**

Each birth is independent. Previous births do not affect the probability of the next child (~50% boy/girl).

**Points:** 1

---

### Question 7 (ID: gambler-5)

**Type:** Multiple Choice

**Question:**

In a fair lottery, Marie has lost 10 times in a row. On the 11th draw, which statement is correct?

**Options:**

a. She has a better chance of winning (return of luck)
b. She has a lower chance of winning (negative streak)
c. Her chances are identical on each draw (past results don't change anything)

**Correct Answer:** c

**Explanation:**

In a fair game of chance, each draw is independent. Past losses do not create a 'debt of luck'. The probability remains the same each time.

**Points:** 1

---

### Question 8 (ID: conjunction-1)

**Type:** ranking

**Question:**

Sophie is 28 years old, dynamic and athletic. She goes jogging every morning. Rank these statements by probability (1 = most probable):

**Options:**

a. Sophie is a teacher
b. Sophie is a nurse
c. Sophie is a nurse and she runs marathons
d. Sophie works in finance

**Explanation:**

P(nurse) > P(nurse and marathons) because P(A) > P(A ∩ B) always. Adding a condition reduces probability.

**Points:** 1

---

### Question 9 (ID: conjunction-2)

**Type:** ranking

**Question:**

Marc likes video games and spends a lot of time on his computer. Rank by probability:

**Options:**

a. Marc works in IT
b. Marc is a video game developer
c. Marc is an accountant
d. Marc works in IT and plays on an e-sports team

**Explanation:**

P(IT) must be ranked more probable than P(IT and e-sports). The conjunction is always less probable.

**Points:** 1

---

### Question 10 (ID: conjunction-3)

**Type:** ranking

**Question:**

Linda is 31 years old, single, outspoken, and very bright. She majored in philosophy. As a student, she was deeply concerned about issues of discrimination and social justice. Rank by probability:

**Options:**

a. Linda is a teacher
b. Linda is a bank teller
c. Linda is active in the feminist movement
d. Linda is a bank teller and active in the feminist movement

**Explanation:**

Despite the description, P(bank teller) > P(bank teller and feminist) mathematically. This is the famous 'Linda problem'.

**Points:** 1

---

### Question 11 (ID: conjunction-4)

**Type:** ranking

**Question:**

Paul reads many history books and often visits museums. Rank by probability:

**Options:**

a. Paul is an engineer
b. Paul is a history teacher
c. Paul is a librarian
d. Paul is a history teacher and author of history books

**Explanation:**

P(history teacher) > P(history teacher and author). Adding a condition always reduces probability.

**Points:** 1

---

### Question 12 (ID: base-rate-1)

**Type:** number

**Question:**

A disease affects 1% of the population. A test correctly detects the disease in 90% of sick people. Among healthy people, the test incorrectly shows positive in 9% of cases. If your test is positive, what is your actual probability of being sick?

**Explanation:**

Out of 10,000 people: 100 are sick (90 test positive), 9,900 are healthy (891 test falsely positive). Probability of being sick = 90/(90+891) ≈ 9.2%. Many people ignore the base rate (1%) and overestimate their probability of being sick.

**Points:** 1

---

### Question 13 (ID: base-rate-2)

**Type:** Multiple Choice

**Question:**

In a company, 70% of employees are engineers and 30% are managers. We know that 20% of engineers and 40% of managers are described as 'charismatic and enjoy leading'. Sophie has been described this way. Is she more likely:

**Options:**

a. Engineer
b. Manager
c. Impossible to determine with this info

**Correct Answer:** a

**Explanation:**

Using Bayes' theorem: P(engineer|description) = (0.70 × 0.20) / [(0.70 × 0.20) + (0.30 × 0.40)] = 0.14 / 0.26 ≈ 54%. Despite the description being 2× more frequent among managers, the high base rate of engineers (70%) tips the balance.

**Points:** 1

---

## Scientific Reasoning (14 items)

**Points:** 14 | **Time:** 8 min

### Question 14 (ID: wason-1)

**Type:** Multiple Choice

**Question:**

Rule to test: 'If a card has a vowel on one side, then it has an even number on the other side.'

You have 4 cards in front of you:
• Card 1 shows: **A**
• Card 2 shows: **K**
• Card 3 shows: **4**
• Card 4 shows: **7**

Which cards would be SUFFICIENT to flip to verify if the rule is respected or violated?

**Options:**

a. Card 1 only
b. Cards 1 and 3
c. Cards 1 and 4
d. All cards
e. Cards 1, 2 and 4

**Correct Answer:** c

**Explanation:**

It's sufficient to flip Card 1 (A - verify the other side = even number) and Card 4 (7 - verify the other side ≠ vowel). Cards 3 and 2 cannot violate the rule.

**Points:** 1

---

### Question 15 (ID: wason-2)

**Type:** Multiple Choice

**Question:**

You're checking the law: 'If a person drinks alcohol, they must be 18 years or older.'

You observe 4 people:
• Person A: **Drinking beer**
• Person B: **Drinking orange juice**
• Person C: **Is 25 years old**
• Person D: **Is 16 years old**

Who would be SUFFICIENT to check to determine if the law is respected or violated?

**Options:**

a. Person A only
b. Persons A and D
c. Persons A and C
d. All persons
e. Persons A, B and D

**Correct Answer:** b

**Explanation:**

You need to check person A (is they ≥18?) and person D (are they drinking alcohol?). The others cannot violate the rule, so checking them would be useless.

**Points:** 1

---

### Question 16 (ID: wason-3)

**Type:** Multiple Choice

**Question:**

Company rule: 'If a project exceeds €50,000, it requires director approval.' 4 files: [Budget: €75,000], [Budget: €30,000], [Approved by director], [Not approved]. Which files would be SUFFICIENT to check to determine whether the rule is followed or violated?

**Options:**

a. Budget €75,000 only
b. Budget €75,000 and Approved
c. Budget €75,000 and Not approved
d. All files
e. Budget €30,000 and Not approved

**Correct Answer:** c

**Explanation:**

It's sufficient to check [€75,000] (approved?) and [Not approved] (budget >€50,000?). The others cannot violate the rule, so checking them would be unnecessary.

**Points:** 1

---

### Question 17 (ID: correlation-1)

**Type:** Multiple Choice

**Question:**

Researchers have discovered that teenagers who smoke tend to have lower IQ scores. Does this mean that preventing teens from smoking would increase their IQ?

**Options:**

a. Yes
b. No
c. Cannot tell

**Correct Answer:** c

**Explanation:**

Correlation ≠ causation. There may be a confounding variable (stress, socioeconomic environment, etc.).

**Points:** 1

---

### Question 18 (ID: correlation-2)

**Type:** Multiple Choice

**Question:**

A study shows that people who drink coffee have less heart disease. Should we recommend coffee for heart health?

**Options:**

a. Yes, the correlation proves the protective effect
b. No, a randomized controlled study is needed
c. Yes, if the correlation is strong

**Correct Answer:** b

**Explanation:**

A correlation doesn't prove causation. Coffee drinkers may have other healthy habits (exercise, diet).

**Points:** 1

---

### Question 19 (ID: correlation-3)

**Type:** Multiple Choice

**Question:**

We observe that cities with more firefighters have more serious fires. Should we reduce the number of firefighters?

**Options:**

a. Yes, they seem to cause fires
b. No, the causality is reversed
c. Yes, if there is a real correlation

**Correct Answer:** b

**Explanation:**

Reverse causality: large cities have more fires, so they hire more firefighters. Firefighters don't cause fires.

**Points:** 1

---

### Question 20 (ID: control-group-1)

**Type:** Multiple Choice

**Question:**

An unpopular school principal is defended because absenteeism has dropped 12% since their appointment. What evidence would best refute this claim?

**Options:**

a. 40% more absences are reported in surveys than in official records
b. Common sense says that a principal has little impact on absenteeism
c. Absenteeism rates in two neighboring cities dropped 18% during the same period
d. The superintendent had questionable business contacts

**Correct Answer:** c

**Explanation:**

Comparison with a control group (similar cities) shows that the drop is general, not due to the principal.

**Points:** 1

---

### Question 21 (ID: control-group-2)

**Type:** Multiple Choice

**Question:**

A new teaching technique shows +15% success on exams. How to verify its effectiveness?

**Options:**

a. Compare with last year's results
b. Ask teachers' opinions
c. Compare with a control group that did not receive the new technique
d. Check if students are satisfied

**Correct Answer:** c

**Explanation:**

A control group is essential. Results may have increased for other reasons (exam difficulty, motivation, etc.).

**Points:** 1

---

### Question 22 (ID: control-group-3)

**Type:** Multiple Choice

**Question:**

A neighborhood installs new streetlights and crime drops 20%. Can we conclude that lighting reduces crime?

**Options:**

a. Yes, 20% is a significant drop
b. No, we must compare with similar neighborhoods without new streetlights
c. Yes, if the drop is sustained over time
d. Yes, lighting logically deters criminals

**Correct Answer:** b

**Explanation:**

Without a control group, we cannot know if the drop is due to streetlights or a general trend of declining crime.

**Points:** 1

---

### Question 23 (ID: likelihood-1)

**Type:** Multiple Choice

**Question:**

Talia has finger thickening. What information is needed to estimate P(hypertrophic osteoarthropathy | thickening)?

**Options:**

a. % of people WITHOUT syndrome who have thickening
b. % of people WITH syndrome
c. % of people WITHOUT syndrome
d. % of people WITH syndrome who have thickening
e. a and d
f. b and c

**Correct Answer:** e

**Explanation:**

You need P(alarm|fire) and P(alarm|no fire) to calculate P(fire|alarm) via Bayes.

In other words: you need to know how often the alarm sounds when there really is a fire (option d), AND how often it sounds mistakenly when there is no fire (option a). These two pieces of information combined allow you to calculate the probability that there really is a fire given that the alarm has sounded.

**Points:** 1

---

### Question 24 (ID: likelihood-2)

**Type:** Multiple Choice

**Question:**

A medical screening test for a disease gives a positive result. To estimate the probability that the patient is actually sick, what information is needed?

**Options:**

a. % of times the test is positive in NON-sick people (false positives)
b. % of sick people in the general population (prevalence)
c. % of healthy people in the population
d. % of times the test correctly detects the disease in sick people (sensitivity)
e. a and d
f. b and c

**Correct Answer:** e

**Explanation:**

You need P(positive test|sick) and P(positive test|not sick) - options a and d. These two conditional probabilities allow you to apply Bayes' theorem to calculate P(sick|positive test).

In other words: you need to know two things: (1) how often the test is positive WHEN the person is really sick (sensitivity, option d), and (2) how often the test is mistakenly positive WHEN the person is not sick (false positive rate, option a). By comparing these two rates, you can determine whether a positive test really indicates the presence of the disease.

**Points:** 1

---

### Question 25 (ID: likelihood-3)

**Type:** Multiple Choice

**Question:**

To evaluate P(Mechanical failure | Abnormal vibrations), what do you need?

**Options:**

a. Only P(Vibrations | Failure)
b. P(Vibrations | Failure) and P(Vibrations | No failure)
c. Only the base rate of failures
d. A mechanic expert's opinion

**Correct Answer:** b

**Explanation:**

For Bayes, you need the likelihood ratio: P(evidence|H) and P(evidence|not-H).

In simple terms: you need to know two things: (1) how often abnormal vibrations are observed WHEN there is a failure, and (2) how often these same vibrations are observed WHEN there is NO failure. It's the comparison of these two frequencies that allows you to determine whether the vibrations really indicate a failure.

**Points:** 1

---

### Question 26 (ID: hypothesis-test-1)

**Type:** Multiple Choice

**Question:**

To test whether a new drug reduces fever, which experiment is best?

**Options:**

a. Give the drug to feverish patients and measure temperature 2h later
b. Ask patients if they feel better after the drug
c. Give the drug to one group and a placebo to a control group, double-blind
d. Compare with other existing drugs

**Correct Answer:** c

**Explanation:**

Randomized controlled double-blind trial: gold standard for testing causal efficacy.

**Points:** 1

---

### Question 27 (ID: hypothesis-test-2)

**Type:** Multiple Choice

**Question:**

A farmer wants to know if a new fertilizer improves yield. Which method is most rigorous?

**Options:**

a. Use it on all fields and compare with last year
b. Use it on half of each field (randomly assigned) and compare
c. Use it on their best fields to maximize the test
d. Ask other farmers who have used it

**Correct Answer:** b

**Explanation:**

Randomization within the same fields controls for confounding variables (soil, water, sunlight).

**Points:** 1

---

## Reflection vs Intuition (7 items)

**Points:** 7 | **Time:** 4 min

### Question 28 (ID: crt-1)

**Type:** number

**Question:**

A bat and a ball cost €1.10 in total. The bat costs €1 more than the ball. How much does the ball cost?

**Explanation:**

5 cents. If the ball = 5c, the bat = €1.05 (€1 more), total = €1.10. Intuition suggests 10c, but that would give a total of €1.20.

**Points:** 1

---

### Question 29 (ID: crt-2)

**Type:** number

**Question:**

If 5 machines take 5 minutes to make 5 parts, how long does it take 100 machines to make 100 parts?

**Explanation:**

5 minutes. Each machine makes 1 part in 5 minutes. So 100 machines make 100 parts in 5 minutes (in parallel). Intuition suggests 100 minutes.

**Points:** 1

---

### Question 30 (ID: crt-3)

**Type:** number

**Question:**

In a lake, there is a water lily. Each day, its size doubles. It takes 48 days to cover the entire lake. In how many days does it cover half the lake?

**Explanation:**

47 days. If the lake is full on day 48 and the size doubles each day, then on day 47 it is half covered. Intuition suggests 24 days.

**Points:** 1

---

### Question 31 (ID: crt-4)

**Type:** number

**Question:**

An elevator takes 1 minute to go up one floor. How long does it take to go from the ground floor to the 25th floor?

**Explanation:**

24 minutes. You need to go up 24 floors to get from the ground floor (floor 0) to the 25th floor. Intuition suggests 25 minutes.

**Points:** 1

---

### Question 32 (ID: crt-6)

**Type:** Multiple Choice

**Question:**

If you are in a race and you pass the runner in second position, what position are you in now?

**Options:**

a. First position
b. Second position
c. Third position

**Correct Answer:** b

**Explanation:**

Second position. You take the place of the one who was 2nd. Intuition suggests 1st position.

**Points:** 1

---

### Question 33 (ID: crt-7)

**Type:** number

**Question:**

A farmer has 15 sheep. All but 9 die. How many remain?

**Explanation:**

9 sheep. 'All but 9' means that 9 survive. Intuition often suggests 6 (15-9).

**Points:** 1

---

### Question 34 (ID: crt-8)

**Type:** number

**Question:**

In a single-elimination chess tournament with 127 players, how many matches are needed to determine the winner?

**Explanation:**

126 matches. Each match eliminates exactly 1 player. To go from 127 to 1 player, you must eliminate 126 players = 126 matches.

**Points:** 1

---

## Belief Bias (12 items)

**Points:** 6 | **Time:** 5 min

### Question 35 (ID: syllogism-1)

**Type:** Multiple Choice

**Question:**

Evaluate only the LOGIC (not the truth in reality):

Premise 1: All mammals can walk.
Premise 2: Whales are mammals.
Conclusion: Whales can walk.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** a

**Explanation:**

Logically valid (AAA1). Even if the conclusion is false in reality, it follows logically from the premises. Inconsistent syllogism (validity ≠ believability).

**Points:** 0.5

---

### Question 36 (ID: syllogism-2)

**Type:** Multiple Choice

**Question:**

Premise 1: All fish are bictodes. Premise 2: No shark is a bictode. Conclusion: No shark is a fish.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** a

**Explanation:**

Logically valid (AEE2). The conclusion follows from the premises, even if it is false in reality. Inconsistent syllogism.

**Points:** 0.5

---

### Question 37 (ID: syllogism-3)

**Type:** Multiple Choice

**Question:**

Premise 1: All flowers need water. Premise 2: Roses need water. Conclusion: Roses are flowers.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** b

**Explanation:**

Logically invalid (AAA2). Even if the conclusion is true, it does not follow logically from the premises. Inconsistent syllogism.

**Points:** 0.5

---

### Question 38 (ID: syllogism-4)

**Type:** Multiple Choice

**Question:**

Premise 1: All precious things are rare. Premise 2: Diamonds are rare. Conclusion: Diamonds are precious.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** b

**Explanation:**

Logically invalid (AAA2). Just because all precious things are rare and diamonds are rare doesn't mean they are precious. Inconsistent syllogism.

**Points:** 0.5

---

### Question 39 (ID: syllogism-5)

**Type:** Multiple Choice

**Question:**

Premise 1: No reptile has fur. Premise 2: All snakes are reptiles. Conclusion: No snake has fur.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** a

**Explanation:**

Logically valid (EAE1). The conclusion follows logically from the premises and is true. Consistent syllogism (validity = believability).

**Points:** 0.5

---

### Question 40 (ID: syllogism-6)

**Type:** Multiple Choice

**Question:**

Premise 1: All birds can fly. Premise 2: Penguins are birds. Conclusion: Penguins can fly.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** a

**Explanation:**

Logically valid (AAA1). The conclusion follows from the premises, even if it is false in reality. Inconsistent syllogism.

**Points:** 0.5

---

### Question 41 (ID: syllogism-7)

**Type:** Multiple Choice

**Question:**

Premise 1: All metals conduct electricity. Premise 2: Copper conducts electricity. Conclusion: Copper is a metal.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** b

**Explanation:**

Logically invalid (AAA2). Even if the conclusion is true, it does not follow from the premises. Inconsistent syllogism.

**Points:** 0.5

---

### Question 42 (ID: syllogism-8)

**Type:** Multiple Choice

**Question:**

Premise 1: All insects have six legs. Premise 2: Spiders have eight legs. Conclusion: Spiders are not insects.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** a

**Explanation:**

Logically valid. The conclusion follows from the premises and is true. Consistent syllogism.

**Points:** 0.5

---

### Question 43 (ID: syllogism-9)

**Type:** Multiple Choice

**Question:**

Evaluate ONLY the LOGIC (not truth in reality):

Premise 1: All plants are photosynthetic organisms.
Premise 2: All ferns are photosynthetic organisms.
Conclusion: All ferns are plants.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** b

**Explanation:**

Logically invalid (AAA2). Even though the conclusion is true (ferns are plants), it doesn't logically follow from the premises. There could be other photosynthetic organisms that aren't plants (algae, certain bacteria). Consistent syllogism: validity ≠ believability.

**Points:** 0.5

---

### Question 44 (ID: syllogism-10)

**Type:** Multiple Choice

**Question:**

Premise 1: All carnivores eat meat. Premise 2: Tigers eat meat. Conclusion: Tigers are carnivores.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** b

**Explanation:**

Logically invalid (AAA2). Even though it's true that tigers are carnivores, this conclusion does not follow logically from the premises. Consistent syllogism.

**Points:** 0.5

---

### Question 45 (ID: syllogism-11)

**Type:** Multiple Choice

**Question:**

Premise 1: No mammal lays eggs. Premise 2: Platypuses lay eggs. Conclusion: Platypuses are not mammals.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** a

**Explanation:**

Logically valid (EAE2). The conclusion follows from the premises, even if it is false (platypuses are mammals). Inconsistent syllogism.

**Points:** 0.5

---

### Question 46 (ID: syllogism-12)

**Type:** Multiple Choice

**Question:**

Premise 1: All land vehicles have wheels. Premise 2: Trains have wheels. Conclusion: Trains are land vehicles.

**Options:**

a. The conclusion follows logically from the premises
b. The conclusion does NOT follow logically from the premises

**Correct Answer:** b

**Explanation:**

Logically invalid (AAA2). Although true, the conclusion does not follow logically from the premises. Consistent syllogism.

**Points:** 0.5

---

## Disjunctive Reasoning (5 items)

**Points:** 5 | **Time:** 4 min

### Question 47 (ID: disj-1)

**Type:** Multiple Choice

**Question:**

Three stacked boxes: [Top: fresh strawberries], [Middle: ?], [Bottom: frozen strawberries]. Fresh strawberries must NOT touch frozen ones. Does a box of fresh strawberries touch a box of frozen strawberries?

**Options:**

a. Yes
b. No
c. Cannot determine

**Correct Answer:** a

**Explanation:**

Yes. If Middle = fresh, then Middle touches Bottom (frozen). If Middle = frozen, then Top (fresh) touches Middle. In both cases: violation.

**Points:** 1

---

### Question 48 (ID: disj-2)

**Type:** Multiple Choice

**Question:**

Anne is looking at Paul. Paul is looking at Marie. Anne is married. Marie is not married. We don't know if Paul is married. Is a married person looking at an unmarried person?

**Options:**

a. Yes
b. No
c. Cannot determine

**Correct Answer:** a

**Explanation:**

Yes. If Paul is married, he is looking at Marie (unmarried). If Paul is not married, Anne (married) is looking at him. In both cases: yes.

**Points:** 1

---

### Question 49 (ID: disj-3)

**Type:** Multiple Choice

**Question:**

Three aligned doors: [Door A: open], [Door B: ?], [Door C: closed]. At least two consecutive doors must be in the same state. Is door B open or closed?

**Options:**

a. Open
b. Closed
c. Cannot determine

**Correct Answer:** c

**Explanation:**

Cannot determine. If B is open: A-B are consecutive and open (OK). If B is closed: B-C are consecutive and closed (OK). Both are possible.

**Points:** 1

---

### Question 50 (ID: disj-4)

**Type:** Multiple Choice

**Question:**

Three people: John (tie), Marc (?), Sophie (no tie). Rule: If someone wears a tie, their immediate neighbor does not wear one. Does Marc wear a tie?

**Options:**

a. Yes
b. No
c. Cannot determine

**Correct Answer:** b

**Explanation:**

No. If Marc wears a tie, then John (his neighbor) should not wear one (contradiction). So Marc does not wear a tie.

**Points:** 1

---

### Question 51 (ID: disj-5)

**Type:** Multiple Choice

**Question:**

A coin is tossed twice. We know that: at least one toss gives Heads. What is the probability that both tosses give Heads?

**Options:**

a. 1/4
b. 1/3
c. 1/2
d. 2/3
e. Cannot determine

**Correct Answer:** b

**Explanation:**

1/3. Possible cases knowing at least one Heads: (H,H), (H,T), (T,H). Only (H,H) satisfies 'both Heads' → 1 case out of 3.

**Points:** 1

---

## Anchoring (6 items)

**Points:** 3 | **Time:** 4 min

### Question 52 (ID: anchor-1)

**Type:** number

**Question:**

Is the distance from San Francisco to Hawaii greater than 500 miles? In your opinion, what is the exact distance?

**Explanation:**

The actual distance is ~2387 miles. The anchor of 500 miles can influence your estimate downward. Points awarded by accuracy: estimate within ±30% = full points, ±60% = partial points. This question tests your ability to make reasonable estimates despite anchoring.

**Points:** 0.5

---

### Question 53 (ID: anchor-2)

**Type:** number

**Question:**

Is Mars's orbital period around the Sun greater than 1500 days? In your opinion, what is the exact duration?

**Explanation:**

The actual duration is ~687 days. The anchor of 1500 days can influence your estimate upward. Points awarded by accuracy: estimate within ±30% = full points, ±60% = partial points. This question tests your ability to make reasonable estimates despite anchoring.

**Points:** 0.5

---

### Question 54 (ID: anchor-3)

**Type:** number

**Question:**

Is Australia's population greater than 10 million inhabitants? In your opinion, what is the exact population?

**Explanation:**

The actual population is ~26 million inhabitants. The anchor of 10 million can influence your estimate downward. Points awarded by accuracy: estimate within ±30% = full points, ±60% = partial points. This question tests your ability to make reasonable estimates despite anchoring.

**Points:** 0.5

---

### Question 55 (ID: anchor-4)

**Type:** number

**Question:**

Is the hottest temperature ever recorded on Earth greater than 70°C? In your opinion, what is this temperature?

**Explanation:**

The actual temperature is ~56.7°C (Death Valley, 1913). The anchor of 70°C can influence your estimate upward. Points awarded by accuracy: estimate within ±30% = full points, ±60% = partial points. This question tests your ability to make reasonable estimates despite anchoring.

**Points:** 0.5

---

### Question 56 (ID: anchor-5)

**Type:** number

**Question:**

Is the Burj Khalifa in Dubai taller than 500 meters? In your opinion, what is its exact height?

**Explanation:**

The actual height is ~828 meters. The anchor of 500 meters can influence your estimate downward. Points awarded by accuracy: estimate within ±30% = full points, ±60% = partial points. This question tests your ability to make reasonable estimates despite anchoring.

**Points:** 0.5

---

### Question 57 (ID: anchor-6)

**Type:** number

**Question:**

Did the Battle of Waterloo take place before 1750? In what year exactly?

**Explanation:**

The actual year is 1815. The anchor of 1750 can influence your estimate downward. Points awarded by accuracy: estimate within ±30% = full points, ±60% = partial points. This question tests your ability to make reasonable estimates despite anchoring.

**Points:** 0.5

---

## Knowledge Calibration (20 items)

**Points:** 2.4 | **Time:** 7 min

### Question 58 (ID: calib-mc-1)

**Type:** multiple-choice-confidence

**Question:**

The Open Door Policy required that:

**Options:**

a. No nation could claim exclusive trading rights in China
b. Journalists must be allowed to observe the effects of the Cultural Revolution

**Points:** 0.12

---

### Question 59 (ID: calib-mc-2)

**Type:** multiple-choice-confidence

**Question:**

The Treaty of Westphalia ended:

**Options:**

a. The Thirty Years' War
b. The Seven Years' War

**Points:** 0.12

---

### Question 60 (ID: calib-mc-3)

**Type:** multiple-choice-confidence

**Question:**

The Suez Canal connects:

**Options:**

a. The Mediterranean and the Red Sea
b. The Atlantic and Pacific Oceans

**Points:** 0.12

---

### Question 61 (ID: calib-mc-4)

**Type:** multiple-choice-confidence

**Question:**

Martin Luther published his 95 Theses in:

**Options:**

a. 1517
b. 1648

**Points:** 0.12

---

### Question 62 (ID: calib-mc-5)

**Type:** multiple-choice-confidence

**Question:**

The Battle of Waterloo took place in:

**Options:**

a. 1815
b. 1789

**Points:** 0.12

---

### Question 63 (ID: calib-mc-6)

**Type:** multiple-choice-confidence

**Question:**

Mount Everest is located in:

**Options:**

a. The Himalayas
b. The Andes

**Points:** 0.12

---

### Question 64 (ID: calib-mc-7)

**Type:** multiple-choice-confidence

**Question:**

World War I began in:

**Options:**

a. 1914
b. 1917

**Points:** 0.12

---

### Question 65 (ID: calib-mc-8)

**Type:** multiple-choice-confidence

**Question:**

Australia is:

**Options:**

a. Larger than Greenland
b. Smaller than Greenland

**Points:** 0.12

---

### Question 66 (ID: calib-mc-9)

**Type:** multiple-choice-confidence

**Question:**

The United States Declaration of Independence dates from:

**Options:**

a. 1776
b. 1789

**Points:** 0.12

---

### Question 67 (ID: calib-mc-10)

**Type:** multiple-choice-confidence

**Question:**

The Great Wall of China is approximately:

**Options:**

a. More than 20,000 km
b. Less than 5,000 km

**Points:** 0.12

---

### Question 68 (ID: calib-interval-1)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: What is the height of the Eiffel Tower?

**Explanation:**

The Eiffel Tower is 330 meters tall (with antenna).

**Points:** 0.12

---

### Question 69 (ID: calib-interval-2)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: What is the population of Japan?

**Explanation:**

Japan has about 125 million inhabitants.

**Points:** 0.12

---

### Question 70 (ID: calib-interval-3)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: In what year did Christopher Columbus discover America?

**Explanation:**

Christopher Columbus discovered America in 1492.

**Points:** 0.12

---

### Question 71 (ID: calib-interval-4)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: What is the length of the Amazon River?

**Explanation:**

The Amazon is approximately 6,400 km long.

**Points:** 0.12

---

### Question 72 (ID: calib-interval-5)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: How many elements does the periodic table contain?

**Explanation:**

The periodic table contains 118 elements.

**Points:** 0.12

---

### Question 73 (ID: calib-interval-6)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: What is the speed of light?

**Explanation:**

The speed of light is approximately 300,000 km/s.

**Points:** 0.12

---

### Question 74 (ID: calib-interval-7)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: What is the boiling point of water at sea level?

**Explanation:**

Water boils at 100°C at sea level.

**Points:** 0.12

---

### Question 75 (ID: calib-interval-8)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: How many countries are members of the United Nations?

**Explanation:**

The UN has 193 member states.

**Points:** 0.12

---

### Question 76 (ID: calib-interval-9)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: What is the Earth-Moon distance?

**Explanation:**

The average Earth-Moon distance is 384,400 km.

**Points:** 0.12

---

### Question 77 (ID: calib-interval-10)

**Type:** confidence-interval

**Question:**

Give a 90% confidence interval: In what year did the French Revolution take place?

**Explanation:**

The French Revolution began in 1789.

**Points:** 0.12

---

## Probabilistic Numeracy (5 items)

**Points:** 5 | **Time:** 3 min

### Question 78 (ID: num-1)

**Type:** number

**Question:**

A drug reduces the risk of infection from 40% to 20%. By how many percentage points does the risk decrease?

**Explanation:**

40% - 20% = 20 percentage points. Not to be confused with relative reduction (50%).

**Points:** 1

---

### Question 79 (ID: num-2)

**Type:** number

**Question:**

In a group of 800 people, 3 out of 10 wear glasses. How many people wear glasses?

**Explanation:**

800 × (3/10) = 800 × 0.3 = 240 people.

**Points:** 1

---

### Question 80 (ID: num-3)

**Type:** number

**Question:**

In a lottery, the probability of winning is 1 in 500. If 5000 people play, approximately how many can we expect to win?

**Explanation:**

5000 / 500 = 10 people.

**Points:** 1

---

### Question 81 (ID: num-4)

**Type:** number

**Question:**

A medical test has a false positive rate of 3%. If 10,000 healthy people take the test, approximately how many will receive a false positive result?

**Explanation:**

10,000 × 0.03 = 300 people.

**Points:** 1

---

### Question 82 (ID: num-5)

**Type:** number

**Question:**

A treatment increases the survival rate from 80% to 92%. What is the percentage reduction in death risk?

**Explanation:**

Initial risk: 20% (100-80). Final risk: 8% (100-92). Reduction: (20-8)/20 = 12/20 = 60%.

**Points:** 1

---

## Superstitious Thinking (10 items)

**Points:** 4.2 | **Time:** 4 min

### Question 83 (ID: super-1)

**Type:** likert

**Question:**

A person's thoughts can influence the movement of a physical object.

**Points:** 0.42

---

### Question 84 (ID: super-2)

**Type:** likert

**Question:**

Astrology can be useful for judging personality.

**Points:** 0.42

---

### Question 85 (ID: super-3)

**Type:** likert

**Question:**

Mind reading is not possible.

**Points:** 0.42

---

### Question 86 (ID: super-4)

**Type:** likert

**Question:**

Some people can accurately predict the future.

**Points:** 0.42

---

### Question 87 (ID: super-5)

**Type:** likert

**Question:**

Ghosts or spirits do not exist.

**Points:** 0.42

---

### Question 88 (ID: super-6)

**Type:** likert

**Question:**

Some lucky charms can really influence events.

**Points:** 0.42

---

### Question 89 (ID: super-7)

**Type:** likert

**Question:**

It is possible to communicate with the dead.

**Points:** 0.42

---

### Question 90 (ID: super-8)

**Type:** likert

**Question:**

Prophetic dreams are just coincidences.

**Points:** 0.42

---

### Question 91 (ID: super-9)

**Type:** likert

**Question:**

Some people possess real psychic powers.

**Points:** 0.42

---

### Question 92 (ID: super-10)

**Type:** likert

**Question:**

Crystals and stones have no healing powers.

**Points:** 0.42

---

## Anti-Science Attitudes (11 items)

**Points:** 4.18 | **Time:** 4 min

### Question 93 (ID: science-1)

**Type:** likert

**Question:**

The fact that scientists often disagree shows that science involves more personal opinions than real evidence.

**Explanation:**

Scientific disagreements are about interpreting evidence, not personal opinions. These debates are part of the normal scientific process and get resolved with the accumulation of new data.

**Points:** 0.38

---

### Question 94 (ID: science-2)

**Type:** likert

**Question:**

When science conflicts with conventional wisdom, it is generally science that is right.

**Explanation:**

Scientific knowledge is the most reliable form of knowledge because it is empirically tested, reproducible, and self-correcting. Trusting science is rational.

**Points:** 0.38

---

### Question 95 (ID: science-3)

**Type:** likert

**Question:**

Science changes its mind too often to be trusted.

**Explanation:**

Science progresses by questioning and revising its theories in light of new evidence. This process of self-correction is a strength, not a weakness. It's what makes science reliable in the long term.

**Points:** 0.38

---

### Question 96 (ID: science-4)

**Type:** likert

**Question:**

Scientists are generally more reliable than non-scientific sources of information.

**Explanation:**

Scientists use rigorous methods, peer review, and require reproducibility of results. These safeguards make them generally more reliable than non-scientific sources.

**Points:** 0.38

---

### Question 97 (ID: science-5)

**Type:** likert

**Question:**

Scientific findings that contradict common sense are probably false.

**Explanation:**

Common sense is often misleading (e.g., the Earth seems flat, heavy objects seem to fall faster). Many counterintuitive scientific discoveries are true (quantum mechanics, relativity).

**Points:** 0.38

---

### Question 98 (ID: science-6)

**Type:** likert

**Question:**

The scientific method is the best way to obtain reliable knowledge.

**Explanation:**

The scientific method is based on observation, experimentation, falsifiability, and reproducibility. It is the best tool we have for understanding objective reality in a reliable way.

**Points:** 0.38

---

### Question 99 (ID: science-7)

**Type:** likert

**Question:**

Scientific studies are sometimes biased by the financial interests of those who fund them.

**Explanation:**

Conflicts of interest can influence research outcomes (e.g., tobacco industry, pharmaceutical studies). Recognizing this reality and demanding transparency about funding are rational positions.

**Points:** 0.38

---

### Question 100 (ID: science-8)

**Type:** likert

**Question:**

Science cannot explain the really important things in life.

**Explanation:**

Science can shed light on many important aspects of life (health, relationships, happiness, morality). Even deep philosophical questions often benefit from scientific perspectives.

**Points:** 0.38

---

### Question 101 (ID: science-9)

**Type:** likert

**Question:**

Scientific evidence should carry more weight than personal testimonials.

**Explanation:**

Large-scale, well-controlled scientific studies are more reliable than personal experience, which is subject to many cognitive biases (confirmation, availability, recency, etc.).

**Points:** 0.38

---

### Question 102 (ID: science-10)

**Type:** likert

**Question:**

Personal intuition is often more reliable than the results of scientific studies.

**Explanation:**

Intuition is subject to many cognitive biases (heuristics, halo effect, anchoring). Scientific studies use rigorous methods to minimize these biases and provide more reliable results.

**Points:** 0.38

---

### Question 103 (ID: science-11)

**Type:** likert

**Question:**

Science has created more problems than it has solved.

**Explanation:**

Science has vastly improved quality of life (medicine, agriculture, sanitation, technology). While it sometimes creates new challenges, the overall balance is overwhelmingly positive.

**Points:** 0.38

---

## Conspiracy Beliefs (11 items)

**Points:** 4.62 | **Time:** 3 min

### Question 104 (ID: conspiracy-1)

**Type:** likert

**Question:**

Evidence that certain childhood vaccines can cause autism has been hidden by pharmaceutical companies.

**Points:** 0.42

---

### Question 105 (ID: conspiracy-2)

**Type:** likert

**Question:**

Governments have hidden evidence of the existence of extraterrestrials and UFOs.

**Points:** 0.42

---

### Question 106 (ID: conspiracy-3)

**Type:** likert

**Question:**

The Apollo moon landing was staged and filmed in a studio.

**Points:** 0.42

---

### Question 107 (ID: conspiracy-4)

**Type:** likert

**Question:**

Climate change is a hoax invented to control the global economy.

**Points:** 0.42

---

### Question 108 (ID: conspiracy-5)

**Type:** likert

**Question:**

Chemtrails (airplane contrails) are used to spread chemicals over the population.

**Points:** 0.42

---

### Question 109 (ID: conspiracy-6)

**Type:** likert

**Question:**

The Earth is flat, contrary to what official science claims.

**Points:** 0.42

---

### Question 110 (ID: conspiracy-7)

**Type:** likert

**Question:**

A 'New World Order' is trying to establish a single world government.

**Points:** 0.42

---

### Question 111 (ID: conspiracy-8)

**Type:** likert

**Question:**

Mind control technologies are being used on the population.

**Points:** 0.42

---

### Question 112 (ID: conspiracy-9)

**Type:** likert

**Question:**

Large pharmaceutical companies are hiding cures for cancer to continue selling treatments.

**Points:** 0.42

---

### Question 113 (ID: conspiracy-10)

**Type:** likert

**Question:**

The Illuminati exist and secretly control world affairs.

**Points:** 0.42

---

### Question 114 (ID: conspiracy-11)

**Type:** likert

**Question:**

Secret medical or scientific experiments are conducted on citizens without their knowledge.

**Points:** 0.42

---

## Dysfunctional Beliefs (9 items)

**Points:** 5.04 | **Time:** 3 min

### Question 115 (ID: dysfunc-1)

**Type:** likert

**Question:**

I must be loved and approved by all the important people in my life.

**Points:** 0.56

---

### Question 116 (ID: dysfunc-2)

**Type:** likert

**Question:**

I must be perfectly competent in everything I undertake.

**Points:** 0.56

---

### Question 117 (ID: dysfunc-3)

**Type:** likert

**Question:**

People who behave badly deserve to be blamed and severely punished.

**Points:** 0.56

---

### Question 118 (ID: dysfunc-4)

**Type:** likert

**Question:**

It is catastrophic when things do not go the way I want.

**Points:** 0.56

---

### Question 119 (ID: dysfunc-5)

**Type:** likert

**Question:**

Unhappiness comes from external circumstances over which I have no control.

**Points:** 0.56

---

### Question 120 (ID: dysfunc-6)

**Type:** likert

**Question:**

I must constantly worry about dangerous or frightening things that might happen.

**Points:** 0.56

---

### Question 121 (ID: dysfunc-7)

**Type:** likert

**Question:**

It is easier to avoid difficulties than to face them.

**Points:** 0.56

---

### Question 122 (ID: dysfunc-8)

**Type:** likert

**Question:**

I need someone stronger than me to rely on.

**Points:** 0.56

---

### Question 123 (ID: dysfunc-9)

**Type:** likert

**Question:**

If something affected me in the past, it will always continue to affect me in the same way.

**Points:** 0.56

---

## Argument Evaluation (8 items)

**Points:** 2.5 | **Time:** 8 min

### Question 124 (ID: arg-eval-1a)

**Type:** likert

**Question:**

**Part A - Your opinion**: Students should have a stronger voice than the general public in defining university policies.

**Points:** 0

---

### Question 125 (ID: arg-eval-1b)

**Type:** Multiple Choice

**Question:**

**Part B - Evaluation**:

**Marc's opinion**: Students should have a stronger voice than the general public in defining university policies.

**Marc's justification**: Since students ultimately pay the operating costs of the university through tuition fees, they should have a stronger voice in university policies.

**Critic's counter-argument**: Tuition fees cover less than half the cost of education at most public universities (assume this is factually correct), so taxpayers should have a more important say in policies.

**Marc's response**: Since students are the ones directly affected by university policies (assume this is factually correct), they should have the strongest voice.

**Evaluate the strength of Marc's response**:

**Options:**

a. 1 - Very weak
b. 2 - Weak
c. 3 - Strong
d. 4 - Very strong

**Correct Answer:** a

**Points:** 0.625

---

### Question 126 (ID: arg-eval-2a)

**Type:** likert

**Question:**

**Part A - Your opinion**: Smoking should be banned in all enclosed public places.

**Points:** 0

---

### Question 127 (ID: arg-eval-2b)

**Type:** Multiple Choice

**Question:**

**Part B - Evaluation**:

**Marc's opinion**: Smoking should be banned in all enclosed public places.

**Marc's justification**: Smoking should be banned in all enclosed public places because even secondhand smoke poses a significant health risk to non-smokers.

**Critic's counter-argument**: Since many smokers already refrain from smoking in places where their secondhand smoke poses a risk to others (assume this is factually correct), it is unnecessary to severely restrict smoking locations.

**Marc's response**: While it is true that many smokers are considerate, it is also true that many smokers are not (assume this is factually correct). Banning smoking would be an effective way to ensure that many of us will not be exposed to the risks posed by secondhand smoke.

**Evaluate the strength of Marc's response**:

**Options:**

a. 1 - Very weak
b. 2 - Weak
c. 3 - Strong
d. 4 - Very strong

**Correct Answer:** d

**Points:** 0.625

---

### Question 128 (ID: arg-eval-3a)

**Type:** likert

**Question:**

**Part A - Your opinion**: Nuclear energy should be developed as the main energy source for the future.

**Points:** 0

---

### Question 129 (ID: arg-eval-3b)

**Type:** Multiple Choice

**Question:**

**Part B - Evaluation**:

**Marc's opinion**: Nuclear energy should be developed as the main energy source for the future.

**Marc's justification**: Nuclear energy is cleaner than fossil fuels and can provide stable and abundant energy to meet our growing needs.

**Critic's counter-argument**: Nuclear accidents like Chernobyl and Fukushima show that nuclear energy carries catastrophic risks (assume this is factually correct).

**Marc's response**: These accidents were due to old technologies and human errors. New fourth-generation nuclear technologies are designed to be much safer (assume this is factually correct).

**Evaluate the strength of Marc's response**:

**Options:**

a. 1 - Very weak
b. 2 - Weak
c. 3 - Strong
d. 4 - Very strong

**Correct Answer:** c

**Points:** 0.625

---

### Question 130 (ID: arg-eval-4a)

**Type:** likert

**Question:**

**Part A - Your opinion**: Social media companies should be legally responsible for content posted by their users.

**Points:** 0

---

### Question 131 (ID: arg-eval-4b)

**Type:** Multiple Choice

**Question:**

**Part B - Evaluation**:

**Marc's opinion**: Social media companies should be legally responsible for content posted by their users.

**Marc's justification**: Platforms profit from user-generated content, so they should be responsible for that content.

**Critic's counter-argument**: It is technically impossible to moderate billions of posts in real time (assume this is factually correct).

**Marc's response**: That's true, but they can invest more in automatic and human moderation systems (assume this is factually correct).

**Evaluate the strength of Marc's response**:

**Options:**

a. 1 - Very weak
b. 2 - Weak
c. 3 - Strong
d. 4 - Very strong

**Correct Answer:** c

**Explanation:**

Marc's response is 'Strong' (3). He acknowledges the technical problem raised by the critic but proposes a concrete solution (investment in moderation). Even if this solution doesn't completely solve the impossibility of real-time moderation, it's a constructive and reasonable response that deserves a positive evaluation.

**Points:** 0.625

---

## Causal Reasoning (5 items)

**Points:** 5 | **Time:** 6 min

### Question 132 (ID: causal-1)

**Type:** Multiple Choice

**Question:**

Researchers found that children who watch a lot of television tend to have poorer academic results than children who watch little television.

Does this finding mean that banning television from children would improve their academic results?

**Options:**

a. Yes, certainly
b. No, not necessarily
c. Cannot be determined from this information alone

**Correct Answer:** b

**Points:** 1

---

### Question 133 (ID: causal-2)

**Type:** Multiple Choice

**Question:**

A study shows that people who take vitamins daily live longer on average than those who don't.

Can we conclude that taking vitamins increases life expectancy?

**Options:**

a. Yes
b. No
c. Impossible to determine

**Correct Answer:** b

**Points:** 1

---

### Question 134 (ID: causal-4)

**Type:** Multiple Choice

**Question:**

An elementary school implemented a new reading program. The principal proudly announces that after one year, students' reading scores increased by 15%.

What additional information would be most useful to evaluate the actual effectiveness of this program?

**Options:**

a. The cost of the program per student
b. The evolution of reading scores in similar schools without the program
c. The number of hours of teacher training
d. Parents' opinions on the program

**Correct Answer:** b

**Points:** 1

---

### Question 135 (ID: causal-5)

**Type:** Multiple Choice

**Question:**

A company claims their new dietary supplement improves memory. In their study, 80% of participants who took the supplement for 3 months reported having better memory.

What would be the best way to verify this claim?

**Options:**

a. Increase the number of participants
b. Compare with a group that took a placebo
c. Extend the study to 6 months
d. Ask participants to keep a journal

**Correct Answer:** b

**Points:** 1

---

### Question 136 (ID: causal-6)

**Type:** Multiple Choice

**Question:**

A doctor prescribes a treatment to a patient. After 2 weeks, the patient feels better and the doctor concludes the treatment works.

What is the main limitation of this conclusion?

**Options:**

a. 2 weeks is too short
b. We don't know if the patient would have recovered spontaneously
c. One patient is not sufficient
d. The patient could be lying

**Correct Answer:** b

**Points:** 1

---

## Framing Effects (10 items)

**Points:** 3 | **Time:** 8 min

### Question 137 (ID: frame-1a)

**Type:** Multiple Choice

**Question:**

You consult employment statistics for a region. You learn that in this region, **92% of the active population is employed**.

How do you evaluate the employment situation in this region?

**Options:**

a. Very favorable
b. Favorable
c. Slightly favorable
d. Slightly unfavorable
e. Unfavorable
f. Very unfavorable

**Correct Answer:** b

**Points:** 0

---

### Question 138 (ID: frame-1b)

**Type:** Multiple Choice

**Question:**

You consult employment statistics for a region. You learn that in this region, **8% of the active population is unemployed**.

How do you evaluate the employment situation in this region?

**Options:**

a. Very favorable
b. Favorable
c. Slightly favorable
d. Slightly unfavorable
e. Unfavorable
f. Very unfavorable

**Correct Answer:** b

**Points:** 0.6

---

### Question 139 (ID: frame-2a)

**Type:** Multiple Choice

**Question:**

Imagine a new disease threatens 600 people. Two treatments are proposed:

**Treatment A**: 200 people will be saved with certainty
**Treatment B**: 1/3 chance of saving all 600 people, 2/3 chance of saving no one

Which treatment do you choose?

**Options:**

a. Treatment A
b. Treatment B

**Points:** 0

---

### Question 140 (ID: frame-2b)

**Type:** Multiple Choice

**Question:**

Imagine a new disease threatens 600 people. Two treatments are proposed:

**Treatment A**: 400 people will die with certainty
**Treatment B**: 1/3 chance that no one dies, 2/3 chance that 600 people die

Which treatment do you choose?

**Options:**

a. Treatment A
b. Treatment B

**Points:** 0.6

---

### Question 141 (ID: frame-3a)

**Type:** Multiple Choice

**Question:**

A new car model has been tested. The report indicates the vehicle **functions correctly 94% of the time**.

What is your impression of the reliability of this vehicle?

**Options:**

a. Very favorable
b. Favorable
c. Slightly favorable
d. Slightly unfavorable
e. Unfavorable
f. Very unfavorable

**Correct Answer:** b

**Points:** 0

---

### Question 142 (ID: frame-3b)

**Type:** Multiple Choice

**Question:**

A new car model has been tested. The report indicates the vehicle **experiences malfunctions 6% of the time**.

What is your impression of the reliability of this vehicle?

**Options:**

a. Very favorable
b. Favorable
c. Slightly favorable
d. Slightly unfavorable
e. Unfavorable
f. Very unfavorable

**Correct Answer:** b

**Points:** 0.6

---

### Question 143 (ID: frame-4a)

**Type:** Multiple Choice

**Question:**

An airline announces that **99.7% of its flights arrive without safety incidents**.

What do you think about this airline's safety?

**Options:**

a. Very safe
b. Safe
c. Slightly safe
d. Slightly risky
e. Risky
f. Very risky

**Correct Answer:** b

**Points:** 0

---

### Question 144 (ID: frame-4b)

**Type:** Multiple Choice

**Question:**

An airline announces that **0.3% of its flights experience a safety incident**.

What do you think about this airline's safety?

**Options:**

a. Very safe
b. Safe
c. Slightly safe
d. Slightly risky
e. Risky
f. Very risky

**Correct Answer:** b

**Points:** 0.6

---

### Question 145 (ID: frame-5a)

**Type:** Multiple Choice

**Question:**

A new medication is tested. Results show that **85% of patients see their condition improve**.

What do you think about the effectiveness of this medication?

**Options:**

a. Very effective
b. Effective
c. Moderately effective
d. Slightly effective
e. Ineffective
f. Totally ineffective

**Correct Answer:** b

**Points:** 0

---

### Question 146 (ID: frame-5b)

**Type:** Multiple Choice

**Question:**

A new medication is tested. Results show that **15% of patients see no improvement**.

What do you think about the effectiveness of this medication?

**Options:**

a. Very effective
b. Effective
c. Moderately effective
d. Slightly effective
e. Ineffective
f. Totally ineffective

**Correct Answer:** b

**Points:** 0.6

---

## Sensitivity to Expected Value (12 items)

**Points:** 5.04 | **Time:** 6 min

### Question 147 (ID: ev-1)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 25% chance of winning €2,500 and 75% chance of winning €100
**Bet B**: 25% chance of winning €500 and 75% chance of winning €1,200

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** b

**Points:** 0.42

---

### Question 148 (ID: ev-2)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 15% chance of winning €150 and 85% chance of winning €8
**Bet B**: 15% chance of winning €40 and 85% chance of winning €10

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** a

**Points:** 0.42

---

### Question 149 (ID: ev-3)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 10% chance of winning €200 and 90% chance of winning €12
**Bet B**: 10% chance of winning €60 and 90% chance of winning €15

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** a

**Points:** 0.42

---

### Question 150 (ID: ev-4)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 100% chance of winning €0.75
**Bet B**: 40% chance of winning €2.50 and 60% chance of winning nothing

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** b

**Points:** 0.42

---

### Question 151 (ID: ev-5)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 35% chance of winning €800 and 65% chance of winning €50
**Bet B**: 35% chance of winning €200 and 65% chance of winning €400

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** b

**Points:** 0.42

---

### Question 152 (ID: ev-6)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 20% chance of winning €500 and 80% chance of winning €20
**Bet B**: 20% chance of winning €100 and 80% chance of winning €80

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** a

**Points:** 0.42

---

### Question 153 (ID: ev-7)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 50% chance of winning €300 and 50% chance of winning €100
**Bet B**: 50% chance of winning €250 and 50% chance of winning €150

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** b

**Points:** 0.42

---

### Question 154 (ID: ev-8)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 30% chance of winning €1,000 and 70% chance of winning €50
**Bet B**: 30% chance of winning €400 and 70% chance of winning €200

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** a

**Points:** 0.42

---

### Question 155 (ID: ev-9)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 5% chance of winning €1,000 and 95% chance of winning €10
**Bet B**: 5% chance of winning €200 and 95% chance of winning €20

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** a

**Points:** 0.42

---

### Question 156 (ID: ev-10)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 60% chance of winning €200 and 40% chance of winning €50
**Bet B**: 60% chance of winning €150 and 40% chance of winning €100

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** a

**Points:** 0.42

---

### Question 157 (ID: ev-11)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 80% chance of winning €100 and 20% chance of winning €10
**Bet B**: 80% chance of winning €90 and 20% chance of winning €30

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** a

**Points:** 0.42

---

### Question 158 (ID: ev-12)

**Type:** Multiple Choice

**Question:**

Which bet do you prefer?

**Bet A**: 45% chance of winning €600 and 55% chance of winning €100
**Bet B**: 45% chance of winning €300 and 55% chance of winning €250

**Options:**

a. Bet A
b. Bet B

**Correct Answer:** a

**Points:** 0.42

---

## Sunk Cost Fallacy (4 items)

**Points:** 3 | **Time:** 4 min

### Question 159 (ID: sunk-1)

**Type:** Multiple Choice

**Question:**

You bought a concert ticket for €80. On the day of the concert, you fall ill (fever, fatigue). The concert won't refund you.

What should you do?

**Options:**

a. Go to the concert anyway to not waste the €80
b. Stay home and rest, the €80 is already lost
c. Try to sell the ticket

**Correct Answer:** b

**Points:** 0.75

---

### Question 160 (ID: sunk-2)

**Type:** Multiple Choice

**Question:**

You've invested €10,000 in a project for 6 months. After analysis, you realize the project will never be profitable. You can either:

• Continue and lose €5,000 more before failure
• Stop now and only lose the €10,000 already invested

What to do?

**Options:**

a. Continue, otherwise the €10,000 will have been wasted for nothing
b. Stop immediately to limit losses
c. Continue for 3 more months to be sure

**Correct Answer:** b

**Points:** 0.75

---

### Question 161 (ID: sunk-3)

**Type:** Multiple Choice

**Question:**

You spent 3 hours cooking an elaborate dish. When tasting it, you realize it's ruined (too salty, inedible). You could order food (€15, delicious) or force yourself to eat your ruined dish.

What to do?

**Options:**

a. Eat the ruined dish to not waste the 3 hours of work
b. Order food, the 3 hours are already lost
c. Try to fix the dish

**Correct Answer:** b

**Points:** 0.75

---

### Question 162 (ID: sunk-4)

**Type:** Multiple Choice

**Question:**

You bought an annual gym membership (€600, non-refundable). After 2 months, you realize you hate this gym (far, mediocre equipment). A new gym opened near you (€50/month).

What to do?

**Options:**

a. Continue with the old gym to make the €600 worthwhile
b. Switch to the new gym, the €600 is already lost
c. Alternate between the two gyms

**Correct Answer:** b

**Points:** 0.75

---

