# Plan d'ajout des 6 nouveaux modules

## Contraintes
- Actuel : 156 questions, 94 points
- Maximum : 166 questions (+10)
- Stratégie : Supprimer 30 questions, ajouter 40 questions

## 1. Modules existants - Suppressions (30 questions)

| Module | Actuel | Nouveau | Diff |
|--------|--------|---------|------|
| Raisonnement Probabiliste | 18q, 18pts | 15q, 15pts | -3 |
| Raisonnement Scientifique | 20q, 20pts | 14q, 14pts | -6 |
| Réflexion vs Intuition → Resistance to Miserly Processing | 11q, 10pts | 8q, 10pts | -3 |
| Biais de Croyance | 16q, 8pts | 12q, 8pts | -4 |
| Raisonnement Disjonctif | 6q, 6pts | 5q, 5pts | -1 |
| Ancrage | 8q, 4pts | 6q, 4pts | -2 |
| Calibration des Connaissances | 26q, 3pts | 20q, 3pts | -6 |
| Numératie Probabiliste | 5q, 5pts | 5q, 5pts | 0 |
| Pensée Superstitieuse | 12q, 5pts | 10q, 5pts | -2 |
| Attitudes Anti-Science | 13q, 5pts | 11q, 5pts | -2 |
| Croyances Conspirationnistes | 12q, 5pts | 11q, 5pts | -1 |
| Croyances Dysfonctionnelles | 9q, 5pts | 9q, 5pts | 0 |
| **TOTAL SUPPRESSIONS** | | | **-30** |

## 2. Nouveaux modules - Ajouts (40 questions)

| Module | Questions | Points | Source |
|--------|-----------|--------|---------|
| Argument Evaluation | 8 | 5 | Nouvelles questions |
| Causal Reasoning | 6 | 6 | Nouvelles questions |
| Framing Effects | 10 (5 paires) | 6 | Nouvelles questions |
| Sensitivity to Expected Value | 12 | 5 | Nouvelles questions |
| Sunk Cost Fallacy | 4 | 3 | Nouvelles questions |
| **TOTAL AJOUTS** | **40** | **25** | |

## 3. Résultat final

**Version complète finale** :
- **166 questions** (au lieu de 156)
- **119 points** (au lieu de 94)
- **~70-75 minutes** (au lieu de 61)
- **18 modules** (au lieu de 12)

## 4. Ordre d'implémentation

1. ✅ Modifications simples (percentile, CART info, tableau)
2. 🔄 Créer les nouveaux modules en français
3. 🔄 Créer les nouveaux modules en anglais
4. 🔄 Modifier les modules existants (supprimer questions)
5. 🔄 Mettre à jour le système de scoring
6. 🔄 Mettre à jour la page résultats
7. 🔄 Tests et vérification
8. 🔄 Commit et push

## 5. Détails des nouveaux modules

### Argument Evaluation (8 questions, 5 points)
Type : Opinion préalable + Évaluation d'arguments
Format : Partie A (likert 4 points) + Partie B (évaluation 1-4)
Scoring : Régression bêta entre évaluations utilisateur et experts

### Causal Reasoning (6 questions, 6 points)
Type : Multiple choice
- 3 questions sur Corrélation ≠ Causation
- 3 questions sur Control Group Reasoning

### Framing Effects (10 questions = 5 paires, 6 points)
Type : Paires de questions avec cadrage différent
Format : 2 versions (positive/négative) de la même question
Scoring : Différence entre réponses des 2 versions (moins = mieux)

### Sensitivity to Expected Value (12 questions, 5 points)
Type : Multiple choice sur choix de paris
Format : Comparer 2 paris et choisir celui avec la meilleure valeur espérée
Scoring : 1 point par bonne réponse

### Sunk Cost Fallacy (4 questions, 3 points)
Type : Scenarios + multiple choice
Format : Situations avec coûts irrécupérables
Scoring : Résistance à la fallacy du coût irrécupérable
