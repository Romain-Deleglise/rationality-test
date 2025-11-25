# Test de Rationalité - Questions Complètes (Version Mise à Jour)

**Version:** complète
**Points totaux:** 93.06
**Temps estimé:** 87 minutes

---

## Raisonnement Probabiliste (13 items)

**Points:** 13 | **Temps:** 5 min

### Question 1 (ID: prob-match-1)

**Type:** Choix multiple

**Question:**

Un jeu de cartes contient 60% de cartes rouges et 40% de cartes bleues. Vous devez prédire la couleur avant chaque tirage (avec remise). Sur 100 tirages, quelle stratégie vous donnera le PLUS grand nombre de prédictions correctes ?

**Options:**

a. Toujours prédire rouge
b. Prédire rouge 60 fois et bleu 40 fois
c. Alterner entre rouge et bleu de façon égale

**Réponse correcte:** a

**Explication:**

Toujours prédire rouge donne 60% de succès (60/100 correct). Prédire rouge 60 fois et bleu 40 fois donne seulement ~52% de succès en moyenne. L'erreur de 'probability matching' consiste à reproduire les proportions au lieu de toujours choisir l'option la plus probable.

**Points:** 1

---

### Question 2 (ID: prob-match-2)

**Type:** Choix multiple

**Question:**

Une machine produit des pièces défectueuses 30% du temps et des bonnes pièces 70% du temps. Pour deviner l'état de la prochaine pièce, quelle stratégie est la meilleure ?

**Options:**

a. Toujours deviner 'bonne pièce'
b. Deviner 'défectueuse' 3 fois sur 10 et 'bonne' 7 fois sur 10
c. Alterner de façon aléatoire

**Réponse correcte:** a

**Explication:**

Toujours deviner l'option la plus probable (70%) est optimal. Essayer de 'matcher' les probabilités réduit votre taux de réussite.

**Points:** 1

---

### Question 3 (ID: gambler-1)

**Type:** Choix multiple

**Question:**

Une pièce équilibrée (50-50 pile ou face) vient de tomber sur pile cinq fois d'affilée. Pour le sixième lancer :

**Options:**

a. Il est plus probable que face sorte
b. Il est plus probable que pile sorte
c. Pile et face sont également probables

**Réponse correcte:** c

**Explication:**

Les lancers sont indépendants. La pièce n'a pas de mémoire. P(pile) = P(face) = 50% à chaque lancer, peu importe l'historique.

**Points:** 1

---

### Question 4 (ID: gambler-2)

**Type:** Choix multiple

**Question:**

À la roulette, le rouge est sorti 7 fois de suite. Quelle couleur a le plus de chances de sortir au prochain tour ?

**Options:**

a. Rouge
b. Les deux ont les mêmes chances
c. Noir

**Réponse correcte:** b

**Explication:**

Chaque tour est indépendant. Les résultats passés n'influencent pas les tours futurs. C'est l'erreur du 'gambler's fallacy'.

**Points:** 1

---

### Question 5 (ID: gambler-3)

**Type:** Choix multiple

**Question:**

Vous lancez un dé équilibré. Il tombe sur 6 trois fois consécutives. Au quatrième lancer, quelle face a la plus grande probabilité de sortir ?

**Options:**

a. Un nombre différent de 6
b. Le 6 à nouveau
c. Toutes les faces ont la même probabilité (1/6)

**Réponse correcte:** c

**Explication:**

Le dé n'a pas de mémoire. Chaque lancer est indépendant. Toutes les faces ont exactement 1/6 de chances à chaque fois.

**Points:** 1

---

### Question 6 (ID: gambler-4)

**Type:** Choix multiple

**Question:**

Un couple a 4 filles. Ils veulent un cinquième enfant. Quelle est la probabilité que ce soit un garçon ?

**Options:**

a. Plus de 50% (ils sont 'dus' pour un garçon)
b. Environ 50% (indépendant des naissances précédentes)
c. Moins de 50% (ils ont tendance à faire des filles)

**Réponse correcte:** b

**Explication:**

Chaque naissance est indépendante. Les naissances précédentes n'affectent pas la probabilité du prochain enfant (~50% garçon/fille).

**Points:** 1

---

### Question 7 (ID: gambler-5)

**Type:** Choix multiple

**Question:**

Dans une loterie équitable, Marie a perdu 10 fois d'affilée. Au 11ème tirage, quelle affirmation est correcte ?

**Options:**

a. Elle a plus de chances de gagner (retour de chance)
b. Elle a moins de chances de gagner (série négative)
c. Ses chances sont identiques à chaque tirage (les résultats passés ne changent rien)

**Réponse correcte:** c

**Explication:**

Dans un jeu de hasard équitable, chaque tirage est indépendant. Les pertes passées ne créent pas de 'dette de chance'. La probabilité reste la même à chaque fois.

**Points:** 1

---

### Question 8 (ID: conjunction-1)

**Type:** Classement

**Question:**

Sophie a 28 ans, elle est dynamique et sportive. Elle fait du jogging tous les matins. Classez ces affirmations par probabilité (1 = plus probable) :

**Options:**

a. Sophie est professeure
b. Sophie est infirmière
c. Sophie est infirmière et elle court des marathons
d. Sophie travaille dans la finance

**Explication:**

P(infirmière) > P(infirmière et marathons) car P(A) > P(A ∩ B) toujours. Ajouter une condition réduit la probabilité.

**Points:** 1

---

### Question 9 (ID: conjunction-2)

**Type:** Classement

**Question:**

Marc aime les jeux vidéo et passe beaucoup de temps sur son ordinateur. Classez par probabilité :

**Options:**

a. Marc travaille dans l'informatique
b. Marc est développeur de jeux vidéo
c. Marc est comptable
d. Marc travaille dans l'informatique et joue dans une équipe e-sport

**Explication:**

P(informatique) doit être classé plus probable que P(informatique et e-sport). La conjonction est toujours moins probable.

**Points:** 1

---

### Question 10 (ID: conjunction-3)

**Type:** Classement

**Question:**

Linda a 31 ans, célibataire, franche et brillante. Elle a étudié la philosophie. Étudiante, elle était préoccupée par la discrimination sociale. Classez par probabilité :

**Options:**

a. Linda est enseignante
b. Linda est caissière
c. Linda est active dans le mouvement féministe
d. Linda est caissière et active dans le mouvement féministe

**Explication:**

Malgré la description, P(caissière) > P(caissière et féministe) mathématiquement. C'est le fameux 'Linda problem'.

**Points:** 1

---

### Question 11 (ID: conjunction-4)

**Type:** Classement

**Question:**

Paul lit beaucoup de livres d'histoire et visite souvent des musées. Classez par probabilité :

**Options:**

a. Paul est ingénieur
b. Paul est professeur d'histoire
c. Paul est bibliothécaire
d. Paul est professeur d'histoire et auteur de livres historiques

**Explication:**

P(professeur d'histoire) > P(professeur d'histoire et auteur). Ajouter une condition réduit toujours la probabilité.

**Points:** 1

---

### Question 12 (ID: base-rate-1)

**Type:** Numérique

**Question:**

Une maladie touche 1% de la population. Un test la détecte correctement dans 90% des cas chez les malades. Chez les personnes saines, le test donne un résultat positif erroné dans 9% des cas. Si votre test est positif, quelle est votre probabilité réelle d'être malade ?

**Réponse correcte:** 9 %

**Explication:**

Sur 10000 personnes : 100 sont malades (90 testent positif), 9900 sont saines (891 testent faussement positif). Probabilité d'être malade = 90/(90+891) ≈ 9,2%. Beaucoup de gens ignorent le taux de base (1%) et surestiment leur probabilité d'être malade.

**Points:** 1

---

### Question 13 (ID: base-rate-2)

**Type:** Choix multiple

**Question:**

Dans une entreprise, 70% des employés sont ingénieurs et 30% sont managers. Sophie a été décrite comme 'charismatique et aimant diriger'. Est-elle plus probablement :

**Options:**

a. Ingénieure
b. Manager
c. Impossible à déterminer avec ces infos

**Réponse correcte:** a

**Explication:**

Sans données sur la prévalence de ces traits dans chaque groupe, le taux de base (70% ingénieurs vs 30% managers) est la seule information objective. Beaucoup ignorent ce taux de base et jugent uniquement sur la représentativité de la description (biais de représentativité). La réponse rationnelle est 'Ingénieure' car c'est le groupe le plus nombreux.

**Points:** 1

---

## Raisonnement Scientifique (14 items)

**Points:** 14 | **Temps:** 8 min

### Question 14 (ID: wason-1)

**Type:** Choix multiple

**Question:**

Règle à tester : 'Si une carte a une voyelle d'un côté, alors elle a un nombre pair de l'autre côté.'

Vous avez 4 cartes devant vous :
• Carte 1 montre : **A**
• Carte 2 montre : **K**
• Carte 3 montre : **4**
• Carte 4 montre : **7**

Quelles cartes SUFFIRAIT-IL de retourner pour vérifier si la règle est respectée ou violée ?

**Options:**

a. Carte 1 seulement
b. Cartes 1 et 3
c. Cartes 1 et 4
d. Toutes les cartes
e. Cartes 1, 2 et 4

**Réponse correcte:** c

**Explication:**

Il suffit de retourner la Carte 1 (A - vérifier que l'autre face = nombre pair) et la Carte 4 (7 - vérifier que l'autre face ≠ voyelle). Les cartes 3 et 2 ne peuvent pas violer la règle.

**Points:** 1

---

### Question 15 (ID: wason-2)

**Type:** Choix multiple

**Question:**

Vous vérifiez la loi : 'Si une personne boit de l'alcool, elle doit avoir 18 ans ou plus.'

Vous observez 4 personnes :
• Personne A : **Boit de la bière**
• Personne B : **Boit du jus d'orange**
• Personne C : **A 25 ans**
• Personne D : **A 16 ans**

Qui SUFFIRAIT-IL de vérifier pour déterminer si la loi est respectée ou violée ?

**Options:**

a. Personne A seulement
b. Personnes A et D
c. Personnes A et C
d. Toutes les personnes
e. Personnes A, B et D

**Réponse correcte:** b

**Explication:**

Il suffit de vérifier la personne A (a-t-elle ≥18 ans ?) et la personne D (boit-elle de l'alcool ?). Les autres ne peuvent pas violer la règle, donc les vérifier serait inutile.

**Points:** 1

---

### Question 16 (ID: wason-3)

**Type:** Choix multiple

**Question:**

Règle à tester : 'Si un projet dépasse 50 000€, il nécessite l'approbation du directeur.'

Vous avez 4 dossiers devant vous :
• Dossier 1 : **Budget de 75 000€**
• Dossier 2 : **Budget de 30 000€**
• Dossier 3 : **Approuvé par le directeur**
• Dossier 4 : **Non approuvé**

Quels dossiers SUFFIRAIT-IL de vérifier pour déterminer si la règle est respectée ou violée ?

**Options:**

a. Dossier 1 seulement
b. Dossiers 1 et 3
c. Dossiers 1 et 4
d. Tous les dossiers
e. Dossiers 2 et 4

**Réponse correcte:** c

**Explication:**

Il suffit de vérifier le Dossier 1 (75 000€ - vérifier qu'il est approuvé) et le Dossier 4 (Non approuvé - vérifier que son budget ≤ 50 000€). Les dossiers 2 et 3 ne peuvent pas violer la règle.

**Points:** 1

---

### Question 17 (ID: correlation-1)

**Type:** Choix multiple

**Question:**

Des chercheurs ont découvert que les adolescents qui fument ont tendance à avoir des scores de QI plus faibles. Cela signifie-t-il qu'empêcher les ados de fumer augmenterait leur QI ?

**Options:**

a. Oui
b. Non
c. On ne peut pas le dire

**Réponse correcte:** c

**Explication:**

Corrélation ≠ causalité. Il peut y avoir une variable confondante (stress, environnement socio-économique, etc.).

**Points:** 1

---

### Question 18 (ID: correlation-2)

**Type:** Choix multiple

**Question:**

Une étude montre que les personnes qui boivent du café ont moins de maladies cardiaques. Devrait-on recommander le café pour la santé cardiaque ?

**Options:**

a. Oui, la corrélation prouve l'effet protecteur
b. Non, il faut une étude randomisée contrôlée
c. Oui, si la corrélation est forte

**Réponse correcte:** b

**Explication:**

Une corrélation ne prouve pas la causalité. Les buveurs de café peuvent avoir d'autres habitudes saines (exercice, alimentation).

**Points:** 1

---

### Question 19 (ID: correlation-3)

**Type:** Choix multiple

**Question:**

On observe que les villes avec plus de pompiers ont plus d'incendies graves. Faut-il réduire le nombre de pompiers ?

**Options:**

a. Oui, ils semblent causer les incendies
b. Non, la causalité est inversée
c. Oui, s'il y a une vraie corrélation

**Réponse correcte:** b

**Explication:**

Causalité inversée : les grandes villes ont plus d'incendies, donc embauchent plus de pompiers. Les pompiers ne causent pas les incendies.

**Points:** 1

---

### Question 20 (ID: control-group-1)

**Type:** Choix multiple

**Question:**

Une directrice d'école impopulaire est défendue car l'absentéisme a baissé de 12% depuis sa nomination. Quelle preuve réfuterait le mieux cette affirmation ?

**Options:**

a. 40% plus d'absents sont signalés dans les enquêtes que dans les dossiers officiels
b. Le bon sens dit qu'un directeur a peu d'impact sur l'absentéisme
c. Les taux d'absentéisme des deux villes voisines ont baissé de 18% durant la même période
d. Le surintendant avait des contacts commerciaux douteux

**Réponse correcte:** c

**Explication:**

La comparaison avec un groupe contrôle (villes similaires) montre que la baisse est générale, pas due à la directrice.

**Points:** 1

---

### Question 21 (ID: control-group-2)

**Type:** Choix multiple

**Question:**

Une nouvelle technique pédagogique montre +15% de réussite aux examens. Comment vérifier son efficacité ?

**Options:**

a. Comparer avec les résultats de l'année dernière
b. Demander l'avis des professeurs
c. Comparer avec un groupe témoin qui n'a pas eu la nouvelle technique
d. Vérifier si les élèves sont satisfaits

**Réponse correcte:** c

**Explication:**

Un groupe contrôle est essentiel. Les résultats peuvent avoir augmenté pour d'autres raisons (difficulté de l'examen, motivation, etc.).

**Points:** 1

---

### Question 22 (ID: control-group-3)

**Type:** Choix multiple

**Question:**

Un quartier installe de nouveaux lampadaires et le crime baisse de 20%. Peut-on conclure que l'éclairage réduit le crime ?

**Options:**

a. Oui, 20% est une baisse significative
b. Non, il faut comparer avec des quartiers similaires sans nouveaux lampadaires
c. Oui, si la baisse se maintient dans le temps
d. Oui, l'éclairage dissuade logiquement les criminels

**Réponse correcte:** b

**Explication:**

Sans groupe contrôle, on ne peut pas savoir si la baisse est due aux lampadaires ou à une tendance générale de baisse du crime.

**Points:** 1

---

### Question 23 (ID: likelihood-1)

**Type:** Choix multiple

**Question:**

Une alarme d'incendie se déclenche. Quelles infos sont nécessaires pour estimer P(incendie réel | alarme déclenchée) (c'est-à-dire la probabilité qu'il y ait vraiment un incendie sachant que l'alarme s'est déclenchée) ?

**Options:**

a. % de fois où l'alarme se déclenche SANS incendie (fausses alarmes)
b. % d'incendies réels (fréquence de base)
c. % de situations sans incendie (fréquence de base)
d. % de fois où l'alarme se déclenche lors d'un incendie RÉEL
e. a et d
f. b et c

**Réponse correcte:** e

**Explication:**

Il faut P(alarme|incendie) (la probabilité que l'alarme sonne sachant qu'il y a un incendie) et P(alarme|pas incendie) (la probabilité que l'alarme sonne sachant qu'il n'y a pas d'incendie) pour calculer P(incendie|alarme) (la probabilité qu'il y ait un incendie sachant que l'alarme sonne) via Bayes.

En d'autres termes : vous devez savoir à quelle fréquence l'alarme sonne quand il y a vraiment un incendie (option d), ET à quelle fréquence elle sonne par erreur quand il n'y a pas d'incendie (option a). Ces deux informations combinées permettent de calculer la probabilité qu'il y ait vraiment un incendie sachant que l'alarme a sonné.

**Points:** 1

---

### Question 24 (ID: likelihood-2)

**Type:** Choix multiple

**Question:**

Un test médical de dépistage d'une maladie donne un résultat positif. Pour estimer la probabilité que le patient soit vraiment malade, quelles informations sont nécessaires ?

**Options:**

a. % de fois où le test est positif chez des personnes NON malades (faux positifs)
b. % de personnes malades dans la population générale (prévalence)
c. % de personnes en bonne santé dans la population
d. % de fois où le test détecte correctement la maladie chez les malades (sensibilité)
e. a et d
f. b et c

**Réponse correcte:** e

**Explication:**

Il faut P(test positif|malade) (la probabilité que le test soit positif sachant que la personne est malade) et P(test positif|non malade) (la probabilité que le test soit positif sachant que la personne n'est pas malade) - soit les options a et d. Ces deux probabilités conditionnelles permettent d'appliquer le théorème de Bayes pour calculer P(malade|test positif) (la probabilité que la personne soit malade sachant que le test est positif).

En d'autres termes : vous devez connaître deux choses : (1) à quelle fréquence le test est positif QUAND la personne est vraiment malade (la sensibilité, option d), et (2) à quelle fréquence le test est positif par erreur QUAND la personne n'est pas malade (le taux de faux positifs, option a). C'est en comparant ces deux taux qu'on peut savoir si un test positif indique vraiment la présence de la maladie.

**Points:** 1

---

### Question 25 (ID: likelihood-3)

**Type:** Choix multiple

**Question:**

Pour évaluer P(Défaillance mécanique | Vibrations anormales) (c'est-à-dire la probabilité qu'il y ait une défaillance mécanique sachant qu'on observe des vibrations anormales), de quoi avez-vous besoin ?

**Options:**

a. Seulement P(Vibrations | Défaillance) (la probabilité d'observer des vibrations sachant qu'il y a une défaillance)
b. P(Vibrations | Défaillance) (la probabilité d'observer des vibrations sachant qu'il y a une défaillance) et P(Vibrations | Pas de défaillance) (la probabilité d'observer des vibrations sachant qu'il n'y a pas de défaillance)
c. Seulement le taux de base des défaillances
d. L'avis d'un expert mécanicien

**Réponse correcte:** b

**Explication:**

Pour Bayes, il faut le rapport de vraisemblance : P(preuve|H) (la probabilité d'observer la preuve sachant que l'hypothèse est vraie) et P(preuve|non-H) (la probabilité d'observer la preuve sachant que l'hypothèse est fausse).

En termes simples : il faut connaître deux choses : (1) à quelle fréquence on observe des vibrations QUAND il y a une défaillance, et (2) à quelle fréquence on observe ces mêmes vibrations QUAND il n'y a PAS de défaillance. C'est la comparaison de ces deux fréquences qui permet de savoir si les vibrations indiquent vraiment une défaillance.

**Points:** 1

---

### Question 26 (ID: hypothesis-test-1)

**Type:** Choix multiple

**Question:**

Pour tester si un nouveau médicament réduit la fièvre, quelle expérience est la meilleure ?

**Options:**

a. Donner le médicament à des patients fiévreux et mesurer la température 2h après
b. Demander aux patients s'ils se sentent mieux après le médicament
c. Donner le médicament à un groupe et un placebo à un groupe contrôle, en double aveugle
d. Comparer avec d'autres médicaments existants

**Réponse correcte:** c

**Explication:**

Essai randomisé contrôlé en double aveugle : gold standard pour tester l'efficacité causale.

**Points:** 1

---

### Question 27 (ID: hypothesis-test-2)

**Type:** Choix multiple

**Question:**

Un agriculteur veut savoir si un nouvel engrais améliore le rendement. Quelle méthode est la plus rigoureuse ?

**Options:**

a. L'utiliser sur tous ses champs et comparer avec l'année dernière
b. L'utiliser sur la moitié de chaque champ (assignée aléatoirement) et comparer
c. L'utiliser sur ses meilleurs champs pour maximiser le test
d. Demander à d'autres agriculteurs qui l'ont utilisé

**Réponse correcte:** b

**Explication:**

Randomisation au sein des mêmes champs contrôle les variables confondantes (sol, eau, ensoleillement).

**Points:** 1

---

## Réflexion vs Intuition (7 items)

**Points:** 7 | **Temps:** 4 min

### Question 28 (ID: crt-1)

**Type:** Numérique

**Question:**

Une batte et une balle coûtent 1,10€ au total. La batte coûte 1€ de plus que la balle. Combien coûte la balle ?

**Réponse correcte:** 5 centimes

**Explication:**

5 centimes. Si la balle = 5c, la batte = 1,05€ (1€ de plus), total = 1,10€. L'intuition suggère 10c, mais cela donnerait un total de 1,20€.

**Points:** 1

---

### Question 29 (ID: crt-2)

**Type:** Numérique

**Question:**

Si 5 machines prennent 5 minutes pour faire 5 pièces, combien de temps prennent 100 machines pour faire 100 pièces ?

**Réponse correcte:** 5 minutes

**Explication:**

5 minutes. Chaque machine fait 1 pièce en 5 minutes. Donc 100 machines font 100 pièces en 5 minutes (en parallèle). L'intuition suggère 100 minutes.

**Points:** 1

---

### Question 30 (ID: crt-3)

**Type:** Numérique

**Question:**

Dans un lac, il y a un nénuphar. Chaque jour, sa taille double. Il faut 48 jours pour couvrir tout le lac. En combien de jours couvre-t-il la moitié du lac ?

**Réponse correcte:** 47 jours

**Explication:**

47 jours. Si le lac est plein au jour 48 et que la taille double chaque jour, alors au jour 47 il est à moitié couvert. L'intuition suggère 24 jours.

**Points:** 1

---

### Question 31 (ID: crt-4)

**Type:** Numérique

**Question:**

Un ascenseur met 1 minute pour monter d'un étage. Combien de temps met-il pour aller du rez-de-chaussée au 25ème étage ?

**Réponse correcte:** 24 minutes

**Explication:**

24 minutes. Il faut monter 24 étages pour aller du rez-de-chaussée (étage 0) au 25ème étage. L'intuition suggère 25 minutes.

**Points:** 1

---

### Question 32 (ID: crt-6)

**Type:** Choix multiple

**Question:**

Si vous êtes en course et que vous dépassez le coureur en deuxième position, à quelle position êtes-vous maintenant ?

**Options:**

a. Première position
b. Deuxième position
c. Troisième position

**Réponse correcte:** b

**Explication:**

Deuxième position. Vous prenez la place de celui qui était 2ème. L'intuition suggère 1ère position.

**Points:** 1

---

### Question 33 (ID: crt-7)

**Type:** Numérique

**Question:**

Un fermier a 15 moutons. Tous sauf 9 meurent. Combien en reste-t-il ?

**Réponse correcte:** 9 moutons

**Explication:**

9 moutons. 'Tous sauf 9' signifie que 9 survivent. L'intuition suggère souvent 6 (15-9).

**Points:** 1

---

### Question 34 (ID: crt-8)

**Type:** Numérique

**Question:**

Dans un tournoi d'échecs à élimination directe avec 127 joueurs, combien de matchs sont nécessaires pour déterminer le gagnant ?

**Réponse correcte:** 126 matchs

**Explication:**

126 matchs. Chaque match élimine exactement 1 joueur. Pour passer de 127 à 1 joueur, il faut éliminer 126 joueurs = 126 matchs.

**Points:** 1

---

## Biais de Croyance (12 items)

**Points:** 6 | **Temps:** 5 min

### Question 35 (ID: syllogism-1)

**Type:** Choix multiple

**Question:**

Évaluez uniquement la LOGIQUE (pas la vérité dans la réalité) :

Prémisse 1 : Tous les mammifères peuvent marcher.
Prémisse 2 : Les baleines sont des mammifères.
Conclusion : Les baleines peuvent marcher.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** a

**Explication:**

Valide logiquement (AAA1). Même si la conclusion est fausse dans la réalité, elle découle logiquement des prémisses. Syllogisme inconsistant (validité ≠ crédibilité).

**Points:** 0.5

---

### Question 36 (ID: syllogism-2)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Tous les fruits sont sucrés. Prémisse 2 : Aucun citron n'est sucré. Conclusion : Aucun citron n'est un fruit.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** a

**Explication:**

Valide logiquement (AEE2). La conclusion suit des prémisses, même si elle est fausse dans la réalité. Syllogisme inconsistant (validité ≠ crédibilité).

**Points:** 0.5

---

### Question 37 (ID: syllogism-3)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Toutes les fleurs ont besoin d'eau. Prémisse 2 : Les roses ont besoin d'eau. Conclusion : Les roses sont des fleurs.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** b

**Explication:**

Invalide logiquement (AAA2). Même si la conclusion est vraie, elle ne découle pas logiquement des prémisses. Syllogisme inconsistant.

**Points:** 0.5

---

### Question 38 (ID: syllogism-4)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Toutes les choses précieuses sont rares. Prémisse 2 : Les diamants sont rares. Conclusion : Les diamants sont précieux.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** b

**Explication:**

Invalide logiquement (AAA2). Ce n'est pas parce que tous les précieux sont rares et que les diamants sont rares qu'ils sont précieux. Syllogisme inconsistant.

**Points:** 0.5

---

### Question 39 (ID: syllogism-5)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Aucun reptile n'a de fourrure. Prémisse 2 : Tous les serpents sont des reptiles. Conclusion : Aucun serpent n'a de fourrure.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** a

**Explication:**

Valide logiquement (EAE1). La conclusion découle logiquement des prémisses et est vraie. Syllogisme consistant (validité = crédibilité).

**Points:** 0.5

---

### Question 40 (ID: syllogism-6)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Tous les oiseaux peuvent voler. Prémisse 2 : Les pingouins sont des oiseaux. Conclusion : Les pingouins peuvent voler.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** a

**Explication:**

Valide logiquement (AAA1). La conclusion suit des prémisses, même si elle est fausse dans la réalité. Syllogisme inconsistant.

**Points:** 0.5

---

### Question 41 (ID: syllogism-7)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Tous les métaux conduisent l'électricité. Prémisse 2 : Le cuivre conduit l'électricité. Conclusion : Le cuivre est un métal.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** b

**Explication:**

Invalide logiquement (AAA2). Même si la conclusion est vraie, elle ne suit pas des prémisses. Syllogisme inconsistant.

**Points:** 0.5

---

### Question 42 (ID: syllogism-8)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Tous les insectes ont six pattes. Prémisse 2 : Les araignées ont huit pattes. Conclusion : Les araignées ne sont pas des insectes.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** a

**Explication:**

Valide logiquement. La conclusion découle des prémisses et est vraie. Syllogisme consistant.

**Points:** 0.5

---

### Question 43 (ID: syllogism-9)

**Type:** Choix multiple

**Question:**

Évaluez uniquement la LOGIQUE (pas la vérité dans la réalité) :

Prémisse 1 : Toutes les plantes produisent de l'oxygène.
Prémisse 2 : Toutes les fougères produisent de l'oxygène.
Conclusion : Toutes les fougères sont des plantes.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** b

**Explication:**

Invalide logiquement (AAA2). Même si la conclusion est vraie (les fougères sont bien des plantes), elle ne suit pas logiquement des prémisses. Il pourrait exister d'autres organismes qui produisent de l'oxygène et qui ne sont pas des plantes (algues, certaines bactéries). Syllogisme consistant : validité ≠ crédibilité.

**Points:** 0.5

---

### Question 44 (ID: syllogism-10)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Tous les carnivores mangent de la viande. Prémisse 2 : Les tigres mangent de la viande. Conclusion : Les tigres sont des carnivores.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** b

**Explication:**

Invalide logiquement (AAA2). Même si c'est vrai que les tigres sont carnivores, cette conclusion ne découle pas logiquement des prémisses. Syllogisme consistant.

**Points:** 0.5

---

### Question 45 (ID: syllogism-11)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Aucun mammifère ne pond d'œufs. Prémisse 2 : Les ornitorynques pondent des œufs. Conclusion : Les ornitorynques ne sont pas des mammifères.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** a

**Explication:**

Valide logiquement (EAE2). La conclusion suit des prémisses, même si elle est fausse (les ornitorynques sont des mammifères). Syllogisme inconsistant.

**Points:** 0.5

---

### Question 46 (ID: syllogism-12)

**Type:** Choix multiple

**Question:**

Prémisse 1 : Tous les véhicules terrestres ont des roues. Prémisse 2 : Les trains ont des roues. Conclusion : Les trains sont des véhicules terrestres.

**Options:**

a. La conclusion suit logiquement des prémisses
b. La conclusion ne suit PAS logiquement des prémisses

**Réponse correcte:** b

**Explication:**

Invalide logiquement (AAA2). Bien que vraie, la conclusion ne suit pas logiquement des prémisses. Syllogisme consistant.

**Points:** 0.5

---

## Raisonnement Disjonctif (5 items)

**Points:** 5 | **Temps:** 4 min

### Question 47 (ID: disj-1)

**Type:** Choix multiple

**Question:**

Trois boîtes empilées : [Haut : fraises fraîches], [Milieu : ?], [Bas : fraises congelées]. Les fraises fraîches ne doivent PAS toucher les congelées. Une boîte de fraises fraîches touche-t-elle une boîte de fraises congelées ?

**Options:**

a. Oui
b. Non
c. On ne peut pas déterminer

**Réponse correcte:** a

**Explication:**

Oui. Si Milieu = fraîches, alors Milieu touche Bas (congelé). Si Milieu = congelé, alors Haut (fraîches) touche Milieu. Dans les deux cas : violation.

**Points:** 1

---

### Question 48 (ID: disj-2)

**Type:** Choix multiple

**Question:**

Anne regarde Paul. Paul regarde Marie. Anne est mariée. Marie n'est pas mariée. On ne sait pas si Paul est marié. Est-ce qu'une personne mariée regarde une personne non mariée ?

**Options:**

a. Oui
b. Non
c. On ne peut pas déterminer

**Réponse correcte:** a

**Explication:**

Oui. Si Paul est marié, il regarde Marie (non mariée). Si Paul n'est pas marié, Anne (mariée) le regarde. Dans les deux cas : oui.

**Points:** 1

---

### Question 49 (ID: disj-3)

**Type:** Choix multiple

**Question:**

Trois portes alignées : [Porte A : ouverte], [Porte B : ?], [Porte C : fermée]. Au moins deux portes consécutives doivent être dans le même état. La porte B est-elle ouverte ou fermée ?

**Options:**

a. Ouverte
b. Fermée
c. On ne peut pas déterminer

**Réponse correcte:** c

**Explication:**

On ne peut pas déterminer. Si B est ouverte : A-B sont consécutives et ouvertes (OK). Si B est fermée : B-C sont consécutives et fermées (OK). Les deux sont possibles.

**Points:** 1

---

### Question 50 (ID: disj-4)

**Type:** Choix multiple

**Question:**

Trois personnes : Jean (cravate), Marc (?), Sophie (pas de cravate). Règle : Si quelqu'un porte une cravate, son voisin immédiat n'en porte pas. Marc porte-t-il une cravate ?

**Options:**

a. Oui
b. Non
c. On ne peut pas déterminer

**Réponse correcte:** b

**Explication:**

Non. Si Marc porte une cravate, alors Jean (son voisin) ne devrait pas en porter (contradiction). Donc Marc ne porte pas de cravate.

**Points:** 1

---

### Question 51 (ID: disj-5)

**Type:** Choix multiple

**Question:**

Une pièce est lancée deux fois. On sait que : au moins un lancer donne Pile. Quelle est la probabilité que les deux lancers donnent Pile ?

**Options:**

a. 1/4
b. 1/3
c. 1/2
d. 2/3
e. On ne peut pas déterminer

**Réponse correcte:** b

**Explication:**

1/3. Cas possibles sachant qu'au moins un Pile : (P,P), (P,F), (F,P). Seul (P,P) satisfait 'deux Pile' → 1 cas sur 3.

**Points:** 1

---

## Ancrage (6 items)

**Points:** 3 | **Temps:** 4 min

### Question 52 (ID: anchor-1)

**Type:** Numérique

**Question:**

La distance de San Francisco à Hawaï est-elle supérieure à 500 miles ? Quelle est selon vous la distance exacte ?

**Réponse correcte:** 2387 miles

**Explication:**

La distance réelle est ~2387 miles. L'ancre de 500 miles peut influencer votre estimation à la baisse. Pour marquer des points, vous devez donner une estimation très éloignée de l'ancre (< 250 miles OU > 1000 miles), montrant que vous n'avez pas été influencé. Cette question mesure la résistance à l'ancrage, pas la connaissance de la bonne réponse.

**Points:** 0.5

*Question d'ancrage (ancre basse)*

---

### Question 53 (ID: anchor-2)

**Type:** Numérique

**Question:**

La durée de l'orbite de Mars autour du Soleil est-elle supérieure à 1500 jours ? Quelle est selon vous la durée exacte ?

**Réponse correcte:** 687 jours

**Explication:**

La durée réelle est 687 jours. L'ancre de 1500 jours peut influencer votre estimation à la hausse. Pour marquer des points, vous devez donner une estimation très éloignée de l'ancre (< 750 jours OU > 3000 jours), montrant que vous n'avez pas été influencé. Cette question mesure la résistance à l'ancrage, pas la connaissance de la bonne réponse.

**Points:** 0.5

*Question d'ancrage (ancre haute)*

---

### Question 54 (ID: anchor-3)

**Type:** Numérique

**Question:**

La vitesse maximale d'un guépard est-elle supérieure à 45 km/h ? Quelle est selon vous cette vitesse exacte ?

**Réponse correcte:** 110 km/h

**Explication:**

La vitesse maximale d'un guépard est d'environ 110 km/h. L'ancre de 45 km/h peut influencer votre estimation à la baisse. Les personnes résistant à l'effet d'ancrage donnent une estimation indépendante de l'ancre présentée.

**Points:** 0.5

*Question d'ancrage (ancre basse)*

---

### Question 55 (ID: anchor-4)

**Type:** Numérique

**Question:**

Le poids moyen d'un éléphant d'Afrique mâle adulte est-il supérieur à 1,5 tonnes ? Quel est selon vous ce poids exact ?

**Réponse correcte:** 6 tonnes

**Explication:**

Un éléphant d'Afrique mâle adulte pèse en moyenne environ 6 tonnes. L'ancre de 1,5 tonnes peut influencer votre estimation à la baisse. Les personnes résistant à l'effet d'ancrage donnent une estimation indépendante de l'ancre présentée.

**Points:** 0.5

*Question d'ancrage (ancre basse)*

---

### Question 56 (ID: anchor-5)

**Type:** Numérique

**Question:**

La vitesse de croisière d'un avion de ligne est-elle supérieure à 340 km/h ? Quelle est selon vous cette vitesse exacte ?

**Réponse correcte:** 900 km/h

**Explication:**

La vitesse de croisière d'un avion de ligne est d'environ 900 km/h. L'ancre de 340 km/h peut influencer votre estimation à la baisse. Les personnes résistant à l'effet d'ancrage donnent une estimation indépendante de l'ancre présentée.

**Points:** 0.5

*Question d'ancrage (ancre basse)*

---

### Question 57 (ID: anchor-6)

**Type:** Numérique

**Question:**

Le nombre d'os dans le corps humain adulte est-il supérieur à 65 ? Quel est selon vous ce nombre exact ?

**Réponse correcte:** 206 os

**Explication:**

Le corps humain adulte contient 206 os. L'ancre de 65 peut influencer votre estimation à la baisse. Les personnes résistant à l'effet d'ancrage donnent une estimation indépendante de l'ancre présentée.

**Points:** 0.5

*Question d'ancrage (ancre basse)*

---

## Calibration des Connaissances (22 items)

**Points:** 6 | **Temps:** 8 min

### Question 58 (ID: calib-mc-1)

**Type:** Choix multiple avec confiance

**Question:**

La Politique de la Porte Ouverte exigeait que :

**Options:**

a. Aucune nation ne puisse revendiquer des droits commerciaux exclusifs en Chine
b. Les journalistes doivent être autorisés à observer les effets de la Révolution culturelle

**Réponse correcte:** a

**Points:** 0.2

---

### Question 59 (ID: calib-mc-2)

**Type:** Choix multiple avec confiance

**Question:**

Le traité de Westphalie a mis fin à :

**Options:**

a. La Guerre de Trente Ans
b. La Guerre de Sept Ans

**Réponse correcte:** a

**Points:** 0.2

---

### Question 60 (ID: calib-mc-3)

**Type:** Choix multiple avec confiance

**Question:**

Le canal de Suez relie :

**Options:**

a. La Méditerranée et la mer Rouge
b. L'océan Atlantique et l'océan Pacifique

**Réponse correcte:** a

**Points:** 0.2

---

### Question 61 (ID: calib-mc-4)

**Type:** Choix multiple avec confiance

**Question:**

Martin Luther a publié ses 95 thèses en :

**Options:**

a. 1517
b. 1648

**Réponse correcte:** a

**Points:** 0.2

---

### Question 62 (ID: calib-mc-5)

**Type:** Choix multiple avec confiance

**Question:**

La bataille de Waterloo a eu lieu en :

**Options:**

a. 1815
b. 1789

**Réponse correcte:** a

**Points:** 0.2

---

### Question 63 (ID: calib-mc-6)

**Type:** Choix multiple avec confiance

**Question:**

Le mont Everest se trouve dans :

**Options:**

a. L'Himalaya
b. Les Andes

**Réponse correcte:** a

**Points:** 0.2

---

### Question 64 (ID: calib-mc-7)

**Type:** Choix multiple avec confiance

**Question:**

La première guerre mondiale a commencé en :

**Options:**

a. 1914
b. 1917

**Réponse correcte:** a

**Points:** 0.2

---

### Question 65 (ID: calib-mc-8)

**Type:** Choix multiple avec confiance

**Question:**

L'Australie est :

**Options:**

a. Plus grande que le Groenland
b. Plus petite que le Groenland

**Réponse correcte:** a

**Points:** 0.2

---

### Question 66 (ID: calib-mc-9)

**Type:** Choix multiple avec confiance

**Question:**

La déclaration d'indépendance des États-Unis date de :

**Options:**

a. 1776
b. 1789

**Réponse correcte:** a

**Points:** 0.2

---

### Question 67 (ID: calib-mc-10)

**Type:** Choix multiple avec confiance

**Question:**

La Grande Muraille de Chine mesure environ :

**Options:**

a. Plus de 20 000 km
b. Moins de 5 000 km

**Réponse correcte:** a

**Points:** 0.2

---

### Question 68 (ID: calib-aggregate-1)

**Type:** Estimation agrégée

**Question:**

Sur les 10 questions précédentes, combien pensez-vous avoir répondu correctement ? (Rappel : en devinant au hasard, on s'attend à en avoir 5 de bonnes)

**Explication:**

Cette question mesure votre capacité à estimer globalement vos performances (calibration agrégée).

**Points:** 1

---

### Question 69 (ID: calib-interval-1)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : Quelle est la hauteur de la Tour Eiffel ?

**Réponse correcte:** 330 mètres

**Explication:**

La Tour Eiffel mesure 330 mètres (avec antenne).

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 70 (ID: calib-interval-2)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : Quelle est la population du Japon ?

**Réponse correcte:** 125 millions d'habitants

**Explication:**

Le Japon a environ 125 millions d'habitants.

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 71 (ID: calib-interval-3)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : En quelle année Christophe Colomb a-t-il découvert l'Amérique ?

**Réponse correcte:** 1492 année

**Explication:**

Christophe Colomb a découvert l'Amérique en 1492.

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 72 (ID: calib-interval-4)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : Quelle est la longueur du fleuve Amazone ?

**Réponse correcte:** 6400 kilomètres

**Explication:**

L'Amazone mesure environ 6 400 km de long.

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 73 (ID: calib-interval-5)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : Combien d'éléments contient le tableau périodique ?

**Réponse correcte:** 118 éléments

**Explication:**

Le tableau périodique contient 118 éléments.

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 74 (ID: calib-interval-6)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : Quelle est la vitesse de la lumière ?

**Réponse correcte:** 300000 km/s

**Explication:**

La vitesse de la lumière est d'environ 300 000 km/s.

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 75 (ID: calib-interval-7)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : Quelle est la température d'ébullition de l'eau au niveau de la mer ?

**Réponse correcte:** 100 degrés Celsius

**Explication:**

L'eau bout à 100°C au niveau de la mer.

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 76 (ID: calib-interval-8)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : Combien de pays sont membres des Nations Unies ?

**Réponse correcte:** 193 pays

**Explication:**

L'ONU compte 193 États membres.

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 77 (ID: calib-interval-9)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : Quelle est la distance Terre-Lune ?

**Réponse correcte:** 384 milliers de km

**Explication:**

La distance moyenne Terre-Lune est de 384 400 km.

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 78 (ID: calib-interval-10)

**Type:** Intervalle de confiance

**Question:**

Donnez un intervalle à 90% : En quelle année a eu lieu la Révolution française ?

**Réponse correcte:** 1789 année

**Explication:**

La Révolution française a commencé en 1789.

**Points:** 0.2

*Vous devez donner un intervalle de confiance à 80% (min - max).*

---

### Question 79 (ID: calib-aggregate-2)

**Type:** Estimation agrégée

**Question:**

Sur les 10 questions d'intervalles précédentes, pour combien de ces questions pensez-vous que votre intervalle contient la bonne réponse ?

**Explication:**

Cette question mesure votre capacité à estimer globalement la qualité de vos intervalles de confiance (calibration agrégée).

**Points:** 1

---

## Numératie Probabiliste (5 items)

**Points:** 5 | **Temps:** 3 min

### Question 80 (ID: num-1)

**Type:** Numérique

**Question:**

Un médicament réduit le risque d'infection de 40% à 20%. De combien de points de pourcentage le risque diminue-t-il ?

**Réponse correcte:** 20 points de %

**Explication:**

40% - 20% = 20 points de pourcentage. Ne pas confondre avec la réduction relative (50%).

**Points:** 1

---

### Question 81 (ID: num-2)

**Type:** Numérique

**Question:**

Dans un groupe de 800 personnes, 3 sur 10 portent des lunettes. Combien de personnes portent des lunettes ?

**Réponse correcte:** 240 personnes

**Explication:**

800 × (3/10) = 800 × 0,3 = 240 personnes.

**Points:** 1

---

### Question 82 (ID: num-3)

**Type:** Numérique

**Question:**

Dans une loterie, la probabilité de gagner est de 1 sur 500. Si 5000 personnes jouent, combien environ peut-on s'attendre à ce qu'elles gagnent ?

**Réponse correcte:** 10 personnes

**Explication:**

5000 / 500 = 10 personnes.

**Points:** 1

---

### Question 83 (ID: num-4)

**Type:** Numérique

**Question:**

Un test médical a un taux de faux positifs de 3%. Si 10 000 personnes saines passent le test, combien environ recevront un résultat faussement positif ?

**Réponse correcte:** 300 personnes

**Explication:**

10 000 × 0,03 = 300 personnes.

**Points:** 1

---

### Question 84 (ID: num-5)

**Type:** Numérique

**Question:**

Un traitement augmente le taux de survie de 80% à 92%. Quel est le pourcentage de réduction du risque de décès ?

**Réponse correcte:** 60 %

**Explication:**

Risque initial : 20% (100-80). Risque final : 8% (100-92). Réduction : (20-8)/20 = 12/20 = 60%.

**Points:** 1

---

## Pensée Superstitieuse (10 items)

**Points:** 4.2 | **Temps:** 4 min

### Question 85 (ID: super-1)

**Type:** Échelle de Likert

**Question:**

Les pensées d'une personne peuvent influencer le mouvement d'un objet physique.

**Réponse correcte:** 1

**Explication:**

La télékinésie (influencer des objets par la pensée) n'a jamais été démontrée scientifiquement malgré de nombreuses études. C'est une croyance superstitieuse sans fondement empirique.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 86 (ID: super-2)

**Type:** Échelle de Likert

**Question:**

L'astrologie peut être utile pour juger de la personnalité.

**Réponse correcte:** 1

**Explication:**

L'astrologie n'a aucun fondement scientifique. Les études contrôlées montrent que les prédictions astrologiques ne sont pas plus précises que le hasard.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 87 (ID: super-3)

**Type:** Échelle de Likert

**Question:**

La lecture de la pensée n'est pas possible.

**Réponse correcte:** 7

**Explication:**

En effet, la télépathie (lecture de pensée) n'a jamais été démontrée de manière reproductible dans des conditions contrôlées. C'est une croyance pseudoscientifique.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 7 (Fortement d'accord)*

---

### Question 88 (ID: super-4)

**Type:** Échelle de Likert

**Question:**

Certaines personnes peuvent prédire l'avenir avec précision.

**Réponse correcte:** 1

**Explication:**

La précognition (prédire l'avenir de manière précise et systématique) n'a jamais été validée scientifiquement. Les prédictions correctes peuvent s'expliquer par le hasard, le biais de confirmation ou des prédictions vagues.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 89 (ID: super-5)

**Type:** Échelle de Likert

**Question:**

Les fantômes ou esprits n'existent pas.

**Réponse correcte:** 7

**Explication:**

Il n'existe aucune preuve scientifique de l'existence de fantômes ou d'esprits. Les phénomènes paranormaux rapportés peuvent s'expliquer par des causes naturelles, des hallucinations ou des erreurs de perception.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 7 (Fortement d'accord)*

---

### Question 90 (ID: super-6)

**Type:** Échelle de Likert

**Question:**

Certains porte-bonheur peuvent vraiment influencer les événements.

**Réponse correcte:** 1

**Explication:**

Les porte-bonheur n'ont aucun effet causal sur les événements. L'impression qu'ils fonctionnent relève du biais de confirmation et de l'illusion de contrôle.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 91 (ID: super-7)

**Type:** Échelle de Likert

**Question:**

Il est possible de communiquer avec les morts.

**Réponse correcte:** 1

**Explication:**

La communication avec les morts n'a jamais été démontrée scientifiquement. Les médiums utilisent des techniques de lecture froide et d'autres astuces psychologiques.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 92 (ID: super-8)

**Type:** Échelle de Likert

**Question:**

Les rêves prémonitoires sont de simples coïncidences.

**Réponse correcte:** 7

**Explication:**

Les rêves prémonitoires apparents sont effectivement des coïncidences. Nous rêvons de nombreuses choses chaque nuit, et occasionnellement certaines correspondent à des événements futurs par pur hasard.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 7 (Fortement d'accord)*

---

### Question 93 (ID: super-9)

**Type:** Échelle de Likert

**Question:**

Certaines personnes possèdent des pouvoirs psychiques réels.

**Réponse correcte:** 1

**Explication:**

Les pouvoirs psychiques (ESP, télékinésie, etc.) n'ont jamais été démontrés dans des conditions contrôlées malgré des décennies de recherche. Les effets apparents relèvent de biais cognitifs ou de fraude.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 94 (ID: super-10)

**Type:** Échelle de Likert

**Question:**

Les cristaux et pierres n'ont aucun pouvoir de guérison.

**Réponse correcte:** 7

**Explication:**

Les cristaux et pierres n'ont aucun pouvoir de guérison démontré au-delà de l'effet placebo. C'est une croyance New Age sans fondement scientifique.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 7 (Fortement d'accord)*

---

## Attitudes Anti-Science (11 items)

**Points:** 4.18 | **Temps:** 4 min

### Question 95 (ID: science-1)

**Type:** Échelle de Likert

**Question:**

Le fait que les scientifiques ne soient souvent pas d'accord montre que la science implique plus d'opinions personnelles que de preuves réelles.

**Réponse correcte:** 1

**Explication:**

Les désaccords scientifiques portent sur l'interprétation des preuves, pas sur des opinions personnelles. Ces débats font partie du processus scientifique normal et se résolvent avec l'accumulation de nouvelles données.

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 96 (ID: science-2)

**Type:** Échelle de Likert

**Question:**

Quand la science entre en conflit avec la sagesse conventionnelle, c'est généralement la science qui a raison.

**Réponse correcte:** 7

**Explication:**

La connaissance scientifique est la forme de connaissance la plus fiable car elle est testée empiriquement, reproductible et auto-correctrice. Faire confiance à la science est rationnel.

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 7 (Fortement d'accord)*

---

### Question 97 (ID: science-3)

**Type:** Échelle de Likert

**Question:**

La science change trop souvent d'avis pour qu'on puisse lui faire confiance.

**Réponse correcte:** 1

**Explication:**

La science progresse en questionnant et en révisant ses théories face à de nouvelles preuves. Ce processus d'auto-correction est une force, pas une faiblesse. C'est ce qui rend la science fiable à long terme.

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 98 (ID: science-4)

**Type:** Échelle de Likert

**Question:**

Les scientifiques sont généralement plus fiables que les sources d'information non scientifiques.

**Réponse correcte:** 7

**Explication:**

Les scientifiques utilisent des méthodes rigoureuses, la revue par les pairs et exigent la reproductibilité des résultats. Ces garde-fous les rendent généralement plus fiables que les sources non scientifiques.

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 7 (Fortement d'accord)*

---

### Question 99 (ID: science-5)

**Type:** Échelle de Likert

**Question:**

Les découvertes scientifiques qui contredisent le bon sens sont probablement fausses.

**Réponse correcte:** 1

**Explication:**

Le bon sens est souvent trompeur (ex: la Terre semble plate, les objets lourds semblent tomber plus vite). De nombreuses découvertes scientifiques contre-intuitives sont vraies (mécanique quantique, relativité).

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 100 (ID: science-6)

**Type:** Échelle de Likert

**Question:**

La méthode scientifique est le meilleur moyen d'obtenir des connaissances fiables.

**Réponse correcte:** 7

**Explication:**

La méthode scientifique repose sur l'observation, l'expérimentation, la falsifiabilité et la reproductibilité. C'est le meilleur outil dont nous disposons pour comprendre la réalité objective de manière fiable.

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 7 (Fortement d'accord)*

---

### Question 101 (ID: science-7)

**Type:** Échelle de Likert

**Question:**

Les études scientifiques sont parfois biaisées par les intérêts financiers de ceux qui les financent.

**Réponse correcte:** 7

**Explication:**

Les conflits d'intérêts peuvent influencer les résultats de recherche (ex: études financées par l'industrie du tabac, pharmaceutique). Reconnaître cette réalité et exiger la transparence sur le financement sont des positions rationnelles.

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 7 (Fortement d'accord)*

---

### Question 102 (ID: science-8)

**Type:** Échelle de Likert

**Question:**

La science ne peut pas expliquer les choses vraiment importantes de la vie.

**Réponse correcte:** 1

**Explication:**

La science peut éclairer de nombreux aspects importants de la vie (santé, relations, bonheur, moralité). Même les questions philosophiques profondes bénéficient souvent de perspectives scientifiques.

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 103 (ID: science-9)

**Type:** Échelle de Likert

**Question:**

Les preuves scientifiques devraient avoir plus de poids que les témoignages personnels.

**Réponse correcte:** 7

**Explication:**

Les études scientifiques à grande échelle et bien contrôlées sont plus fiables que l'expérience personnelle, qui est sujette à de nombreux biais cognitifs (confirmation, disponibilité, récence, etc.).

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 7 (Fortement d'accord)*

---

### Question 104 (ID: science-10)

**Type:** Échelle de Likert

**Question:**

L'intuition personnelle est souvent plus fiable que les résultats d'études scientifiques.

**Réponse correcte:** 1

**Explication:**

L'intuition est sujette à de nombreux biais cognitifs (heuristiques, effet de halo, ancrage). Les études scientifiques utilisent des méthodes rigoureuses pour minimiser ces biais et fournir des résultats plus fiables.

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 105 (ID: science-11)

**Type:** Échelle de Likert

**Question:**

La science a créé plus de problèmes qu'elle n'en a résolu.

**Réponse correcte:** 2

**Explication:**

La science a considérablement amélioré la qualité de vie (médecine, agriculture, assainissement, technologie). Bien qu'elle crée parfois de nouveaux défis (pollution, armes nucléaires), le bilan global est largement positif. Une position nuancée reconnaît à la fois les bénéfices massifs et certains problèmes créés.

**Points:** 0.38

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

## Croyances Conspirationnistes (11 items)

**Points:** 4.62 | **Temps:** 3 min

### Question 106 (ID: conspiracy-1)

**Type:** Échelle de Likert

**Question:**

Les preuves que certains vaccins infantiles peuvent causer l'autisme ont été cachées par des compagnies pharmaceutiques.

**Réponse correcte:** 1

**Explication:**

Il n'existe aucune preuve scientifique liant les vaccins à l'autisme. L'étude frauduleuse de Wakefield (1998) a été rétractée. De nombreuses études à grande échelle ont démontré l'absence de lien. Cette théorie du complot met en danger la santé publique.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 107 (ID: conspiracy-2)

**Type:** Échelle de Likert

**Question:**

Des gouvernements ont caché des preuves de l'existence des extraterrestres et d'OVNI.

**Réponse correcte:** 1

**Explication:**

Malgré des décennies d'observation du ciel par des millions de personnes, il n'existe aucune preuve vérifiable de visites extraterrestres. Les 'preuves cachées' relèvent de la pensée conspirationniste sans fondement empirique.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 108 (ID: conspiracy-3)

**Type:** Échelle de Likert

**Question:**

L'alunissage d'Apollo était une mise en scène filmée dans un studio.

**Réponse correcte:** 1

**Explication:**

L'alunissage d'Apollo est l'un des événements les mieux documentés de l'histoire, avec des preuves multiples : témoignages, photos, échantillons lunaires, réflecteurs laser toujours utilisés. Les arguments conspirationnistes ont tous été réfutés scientifiquement.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 109 (ID: conspiracy-4)

**Type:** Échelle de Likert

**Question:**

Le changement climatique est un canular inventé pour contrôler l'économie mondiale.

**Réponse correcte:** 1

**Explication:**

Le consensus scientifique sur le changement climatique anthropique est écrasant (97%+ des climatologues). Les preuves proviennent de multiples sources indépendantes et convergentes. Cette théorie du complot ignore des décennies de recherche rigoureuse.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 110 (ID: conspiracy-5)

**Type:** Échelle de Likert

**Question:**

Les chemtrails (traînées d'avion) sont utilisés pour répandre des produits chimiques sur la population.

**Réponse correcte:** 1

**Explication:**

Les traînées d'avion (contrails) sont de la vapeur d'eau condensée, un phénomène atmosphérique bien compris. Il n'existe aucune preuve de 'chemtrails' chimiques. Cette théorie repose sur une incompréhension de la météorologie.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 111 (ID: conspiracy-6)

**Type:** Échelle de Likert

**Question:**

La Terre est plate, contrairement à ce que la science officielle prétend.

**Réponse correcte:** 1

**Explication:**

La forme sphérique de la Terre est établie depuis l'Antiquité et confirmée par des preuves convergentes : navigation, astrophysique, photos satellites, voyages spatiaux. La théorie de la Terre plate ignore des millénaires de preuves scientifiques.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 112 (ID: conspiracy-7)

**Type:** Échelle de Likert

**Question:**

Un 'Nouvel Ordre Mondial' tente d'établir un gouvernement mondial unique.

**Réponse correcte:** 1

**Explication:**

Bien que des organisations internationales existent (ONU, UE), il n'existe aucune preuve d'un complot secret pour un gouvernement mondial unique. Cette théorie relève de la pensée conspirationniste paranoïaque sans fondement factuel.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 113 (ID: conspiracy-8)

**Type:** Échelle de Likert

**Question:**

Des technologies secrètes de contrôle mental télépathique existent.

**Réponse correcte:** 1

**Explication:**

Il n'existe aucune preuve scientifique de technologies de contrôle mental télépathique. Les neurosciences montrent que la télépathie et le contrôle mental à distance sont scientifiquement impossibles avec nos connaissances actuelles de la physique et de la biologie.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 114 (ID: conspiracy-9)

**Type:** Échelle de Likert

**Question:**

Les grandes entreprises pharmaceutiques cachent des remèdes contre le cancer pour continuer à vendre des traitements.

**Réponse correcte:** 1

**Explication:**

Les entreprises pharmaceutiques ont un intérêt économique à développer des remèdes efficaces (brevets lucratifs). Cacher un remède contre le cancer serait impossible (trop de personnes impliquées) et contre-productif économiquement. Cette théorie ignore la réalité de la recherche médicale.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 115 (ID: conspiracy-10)

**Type:** Échelle de Likert

**Question:**

Les Illuminati existent et contrôlent secrètement les affaires mondiales.

**Réponse correcte:** 1

**Explication:**

Il n'existe aucune preuve de l'existence des Illuminati comme organisation contrôlant secrètement le monde. Cette théorie du complot confond coïncidences, symbolisme artistique et réalité politique complexe.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 116 (ID: conspiracy-11)

**Type:** Échelle de Likert

**Question:**

Des gouvernements mènent actuellement des expérimentations médicales secrètes à grande échelle sur leurs citoyens à leur insu.

**Réponse correcte:** 1

**Explication:**

Bien que des expérimentations contraires à l'éthique aient existé historiquement (Tuskegee, MKUltra), les cadres éthiques modernes, la surveillance institutionnelle et la transparence rendent de telles pratiques à grande échelle extrêmement difficiles aujourd'hui. Affirmer que cela se produit actuellement de manière généralisée sans preuve relève de la pensée conspirationniste.

**Points:** 0.42

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

## Croyances Dysfonctionnelles (9 items)

**Points:** 5.04 | **Temps:** 3 min

### Question 117 (ID: dysfunc-1)

**Type:** Échelle de Likert

**Question:**

Je DOIS être aimé et approuvé par toutes les personnes importantes de ma vie.

**Réponse correcte:** 1

**Explication:**

Cette croyance est irrationnelle car elle transforme un désir légitime (être aimé) en une exigence absolue. Il est impossible d'être aimé et approuvé par tous, et cette croyance génère anxiété et dépendance affective. Les personnes rationnelles acceptent qu'il est normal de ne pas plaire à tout le monde tout en valorisant les relations authentiques.

**Points:** 0.56

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 118 (ID: dysfunc-2)

**Type:** Échelle de Likert

**Question:**

Je dois être parfaitement compétent dans tout ce que j'entreprends.

**Réponse correcte:** 1

**Explication:**

Exiger la perfection dans tout est irréaliste et source d'anxiété. Il est plus rationnel d'accepter que l'erreur est humaine et de viser l'excellence plutôt que la perfection.

**Points:** 0.56

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 119 (ID: dysfunc-3)

**Type:** Échelle de Likert

**Question:**

Les gens qui se comportent mal ou commettent des erreurs méritent d'être blâmés et punis sévèrement.

**Réponse correcte:** 1

**Explication:**

Blâmer et punir sévèrement les autres pour leurs erreurs est contre-productif et ignore la complexité des comportements humains. Une approche plus rationnelle reconnaît que les comportements ont des causes multiples et que la compréhension est souvent plus efficace que la punition sévère.

**Points:** 0.56

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 120 (ID: dysfunc-4)

**Type:** Échelle de Likert

**Question:**

C'est catastrophique quand les choses ne se passent pas comme je le voudrais.

**Réponse correcte:** 1

**Explication:**

Cette croyance reflète une pensée catastrophique irrationnelle. Les problèmes ont des degrés de gravité variables, et tout qualifier de 'catastrophique' empêche une évaluation réaliste et proportionnée des situations. La plupart des contretemps sont des désagréments, pas des catastrophes.

**Points:** 0.56

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 121 (ID: dysfunc-5)

**Type:** Échelle de Likert

**Question:**

Quand quelque chose de mauvais m'arrive, c'est toujours dû à des facteurs externes, jamais à mes décisions.

**Réponse correcte:** 1

**Explication:**

Cette affirmation reflète un biais d'attribution externe systématique et une sur-généralisation. C'est une erreur de raisonnement car elle utilise des termes absolus ('toujours', 'jamais') qui ignorent la complexité causale des événements. Dans la réalité, les résultats négatifs proviennent généralement d'une combinaison de facteurs internes et externes. Une évaluation rationnelle examine la contribution respective de chaque facteur plutôt que d'attribuer systématiquement la causalité à une seule source.

**Points:** 0.56

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 122 (ID: dysfunc-6)

**Type:** Échelle de Likert

**Question:**

Je dois constamment m'inquiéter des choses dangereuses ou effrayantes qui pourraient arriver.

**Réponse correcte:** 1

**Explication:**

L'inquiétude excessive et constante n'augmente pas le contrôle sur les événements futurs et génère anxiété et stress inutiles. Une approche plus rationnelle consiste à évaluer les risques de manière réaliste, à prendre des précautions raisonnables quand c'est possible, puis à accepter l'incertitude inhérente à la vie.

**Points:** 0.56

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 123 (ID: dysfunc-7)

**Type:** Échelle de Likert

**Question:**

Si j'ignore un problème, il finira par se résoudre tout seul.

**Réponse correcte:** 1

**Explication:**

Cette croyance repose sur une fausse relation causale entre l'inaction et la résolution de problèmes. C'est une forme de pensée magique qui confond l'espoir avec la causalité. Dans la réalité, la plupart des problèmes non traités persistent ou s'aggravent ; ils ne se résolvent pas spontanément par le simple fait de les ignorer. Une approche rationnelle consiste à évaluer objectivement si un problème nécessite une intervention active ou si d'autres facteurs pourraient le résoudre.

**Points:** 0.56

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 124 (ID: dysfunc-8)

**Type:** Échelle de Likert

**Question:**

Je ne peux rien accomplir d'important sans que quelqu'un me dise exactement quoi faire.

**Réponse correcte:** 1

**Explication:**

Cette croyance reflète une sous-estimation systématique de ses propres capacités et peut indiquer une impuissance apprise. C'est une erreur de calibration : affirmer qu'on ne peut 'rien' accomplir d'important de manière autonome est une généralisation excessive qui ignore les nombreuses compétences et ressources dont dispose tout individu. Une auto-évaluation rationnelle reconnaît à la fois ses limites (où le soutien est utile) et ses capacités (où l'autonomie est possible).

**Points:** 0.56

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 125 (ID: dysfunc-9)

**Type:** Échelle de Likert

**Question:**

Si quelque chose m'a affecté dans le passé, cela continuera toujours à m'affecter de la même manière.

**Réponse correcte:** 1

**Explication:**

Cette croyance suggère un déterminisme psychologique irréaliste et ignore la capacité humaine au changement, à l'adaptation et à la résilience. Les recherches en psychologie montrent que les personnes peuvent modifier leurs réactions émotionnelles et comportementales par la thérapie, l'apprentissage et l'expérience. Bien que les traumatismes passés puissent avoir des effets durables, leur impact peut évoluer avec le temps et le traitement approprié.

**Points:** 0.56

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

## Évaluation d'Arguments (8 items)

**Points:** 2.5 | **Temps:** 8 min

### Question 126 (ID: arg-eval-1a)

**Type:** Échelle de Likert

**Question:**

**Partie A - Votre opinion** : Les étudiants devraient avoir une voix plus forte que le grand public dans la définition des politiques universitaires.

**Explication:**

Cette question mesure votre opinion préalable pour détecter le biais de croyance.

**Points:** 0

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 127 (ID: arg-eval-1b)

**Type:** Choix multiple

**Question:**

**Partie B - Évaluation** :

**Opinion de Marc** : Les étudiants devraient avoir une voix plus forte que le grand public dans la définition des politiques universitaires.

**Justification de Marc** : Puisque ce sont les étudiants qui doivent finalement payer les coûts de fonctionnement de l'université par leurs frais de scolarité, ils devraient avoir une voix plus forte dans les politiques universitaires.

**Contre-argument du critique** : Les frais de scolarité couvrent moins de la moitié du coût d'une éducation dans la plupart des universités publiques (supposez que c'est factuellement correct), donc les contribuables devraient avoir leur mot à dire plus important dans les politiques.

**Réponse de Marc** : Certes, mais laissons de côté la question du financement pour l'instant. Ce qui compte vraiment, c'est que les étudiants sont directement influencés par les politiques universitaires au quotidien (supposez que c'est factuellement correct), donc ce sont eux qui devraient avoir la voix la plus forte.

**Évaluez la force de la réponse de Marc** :

**Options:**

a. 1 - Très faible
b. 2 - Faible
c. 3 - Fort
d. 4 - Très fort

**Réponse correcte:** a

**Explication:**

La réponse de Marc est très faible car il esquive explicitement le contre-argument sur le financement ('laissons de côté la question du financement') et introduit un nouvel argument (impact direct) sans défendre son argument initial. C'est un sophisme de déplacement des poteaux de but (moving the goalposts). Une réponse forte aurait dû soit défendre l'argument du financement, soit reconnaître sa faiblesse et expliquer pourquoi l'opinion reste valide malgré cela.

**Points:** 0.625

---

### Question 128 (ID: arg-eval-2a)

**Type:** Échelle de Likert

**Question:**

**Partie A - Votre opinion** : Le tabac devrait être interdit dans tous les lieux publics fermés.

**Explication:**

Cette question mesure votre opinion préalable pour détecter le biais de croyance.

**Points:** 0

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 129 (ID: arg-eval-2b)

**Type:** Choix multiple

**Question:**

**Partie B - Évaluation** :

**Opinion de Marc** : Le tabac devrait être interdit dans tous les lieux publics fermés.

**Justification de Marc** : Le tabac devrait être interdit dans tous les lieux publics fermés car même le tabagisme passif pose un risque sanitaire significatif pour les non-fumeurs.

**Contre-argument du critique** : Puisque de nombreux fumeurs s'abstiennent déjà de fumer dans des endroits où leur fumée secondaire pose un risque pour d'autres (supposez que c'est factuellement correct), il est inutile de restreindre sévèrement les lieux de tabagisme.

**Réponse de Marc** : Bien qu'il soit vrai que de nombreux fumeurs sont prévenants, il est également vrai que de nombreux fumeurs ne le sont pas (supposez que c'est factuellement correct). Interdire le tabac serait un moyen efficace de garantir que beaucoup d'entre nous ne seront pas exposés aux risques posés par la fumée secondaire.

**Évaluez la force de la réponse de Marc** :

**Options:**

a. 1 - Très faible
b. 2 - Faible
c. 3 - Fort
d. 4 - Très fort

**Réponse correcte:** d

**Explication:**

Évaluer la force d'un argument nécessite d'examiner ses preuves et sa structure logique, indépendamment de la source. C'est un principe fondamental de la pensée rationnelle.

**Points:** 0.625

---

### Question 130 (ID: arg-eval-3a)

**Type:** Échelle de Likert

**Question:**

**Partie A - Votre opinion** : Les téléphones portables devraient être interdits dans toutes les écoles.

**Explication:**

Un raisonnement solide peut être jugé indépendamment de nos émotions personnelles sur le sujet. La pensée rationnelle sépare l'évaluation logique des réactions émotionnelles.

**Points:** 0

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 131 (ID: arg-eval-3b)

**Type:** Choix multiple

**Question:**

**Partie B - Évaluation** :

**Opinion de Marc** : Les téléphones portables devraient être interdits dans toutes les écoles.

**Justification de Marc** : Ils distraient les élèves et perturbent l'apprentissage en classe.

**Contre-argument du critique** : Les téléphones peuvent être des outils pédagogiques utiles (recherche, calculatrice, applications éducatives) et permettent aux parents de joindre leurs enfants en cas d'urgence (supposez que c'est factuellement correct).

**Réponse de Marc** : De toute façon, quand j'étais à l'école, on n'avait pas de téléphones et on apprenait très bien.

**Évaluez la force de la réponse de Marc** :

**Options:**

a. 1 - Très faible
b. 2 - Faible
c. 3 - Fort
d. 4 - Très fort

**Réponse correcte:** a

**Explication:**

La réponse de Marc est très faible car elle commet un 'appel à la tradition' (une erreur logique). Dire que 'avant on faisait autrement et ça marchait' ne répond pas aux avantages spécifiques mentionnés (outils pédagogiques modernes, sécurité). De plus, cette logique bloquerait tout progrès technologique en éducation. Marc ne traite ni les bénéfices pédagogiques ni l'aspect sécuritaire soulevés par le critique.

**Points:** 0.625

---

### Question 132 (ID: arg-eval-4a)

**Type:** Échelle de Likert

**Question:**

**Partie A - Votre opinion** : Il faut augmenter significativement les taxes sur les produits sucrés pour réduire l'obésité.

**Explication:**

La cohérence logique et les preuves sont les critères essentiels pour évaluer un argument, pas notre accord avec la conclusion. C'est le fondement de la pensée critique.

**Points:** 0

*Échelle : 1 (Fortement en désaccord) à 6 (Fortement d'accord)*

---

### Question 133 (ID: arg-eval-4b)

**Type:** Choix multiple

**Question:**

**Partie B - Évaluation** :

**Opinion de Marc** : Il faut augmenter significativement les taxes sur les produits sucrés pour réduire l'obésité.

**Justification de Marc** : Des taxes élevées découragent la consommation de produits nocifs pour la santé.

**Contre-argument du critique** : Les taxes sur le sucre affectent de manière disproportionnée les ménages à faible revenu qui dépensent un pourcentage plus élevé de leur budget en alimentation (supposez que c'est factuellement correct).

**Réponse de Marc** : Mais l'obésité et le diabète affectent aussi davantage les populations à faible revenu (supposez que c'est factuellement correct). Une taxe qui réduit leur consommation de sucre améliorerait donc leur santé, ce qui compense largement le coût financier.

**Évaluez la force de la réponse de Marc** :

**Options:**

a. 1 - Très faible
b. 2 - Faible
c. 3 - Fort
d. 4 - Très fort

**Réponse correcte:** c

**Explication:**

La réponse de Marc est forte car elle répond directement au contre-argument. Le critique soulève que la taxe affecte négativement les populations à faible revenu. Marc reconnaît ce point mais montre que ces mêmes populations bénéficieraient le plus de la réduction de consommation de sucre (réduction de l'obésité et du diabète). Il propose ainsi un compromis coût-bénéfice spécifique à la population concernée. C'est une réponse logique qui traite le problème soulevé plutôt que de l'ignorer.

**Points:** 0.625

---

## Raisonnement Causal (5 items)

**Points:** 5 | **Temps:** 5 min

### Question 134 (ID: causal-1)

**Type:** Choix multiple

**Question:**

Des chercheurs ont découvert que les enfants qui regardent beaucoup de télévision ont tendance à obtenir de moins bons résultats scolaires que les enfants qui regardent peu de télévision.

Cette découverte signifie-t-elle qu'interdire la télévision aux enfants améliorerait leurs résultats scolaires ?

**Options:**

a. Oui, cette corrélation prouve que réduire la TV améliorera les résultats
b. Non, la corrélation n'implique pas la causation - d'autres facteurs pourraient expliquer les deux
c. Impossible de répondre car l'étude ne précise pas le type d'émissions regardées

**Réponse correcte:** b

**Explication:**

Non, la corrélation n'implique pas la causation. D'autres facteurs (niveau socio-économique, éducation des parents, environnement familial) pourraient expliquer à la fois plus de TV et de moins bons résultats scolaires. Pour établir un lien causal, il faudrait une étude expérimentale contrôlée ou éliminer les variables confondantes.

**Points:** 1

---

### Question 135 (ID: causal-2)

**Type:** Choix multiple

**Question:**

Une étude montre que les personnes qui prennent des vitamines quotidiennement vivent en moyenne plus longtemps que celles qui n'en prennent pas.

Peut-on conclure que prendre des vitamines augmente l'espérance de vie ?

**Options:**

a. Non, car les personnes qui prennent des vitamines ont probablement déjà un mode de vie plus sain
b. Oui, la différence d'espérance de vie prouve l'effet des vitamines
c. Oui, mais seulement pour certains types de vitamines

**Réponse correcte:** a

**Explication:**

Non, on ne peut pas conclure à un effet causal. Les personnes qui prennent des vitamines quotidiennement sont probablement plus soucieuses de leur santé en général : elles font peut-être plus d'exercice, mangent mieux, consultent régulièrement un médecin, etc. C'est ce mode de vie global plus sain qui pourrait expliquer leur longévité, pas nécessairement les vitamines elles-mêmes. Il s'agit d'un biais de sélection classique.

**Points:** 1

---

### Question 136 (ID: causal-4)

**Type:** Choix multiple

**Question:**

Une école primaire a mis en place un nouveau programme de lecture. Le directeur annonce fièrement qu'après un an, les scores de lecture des élèves ont augmenté de 15%.

Quelle information supplémentaire serait la plus utile pour évaluer l'efficacité réelle de ce programme ?

**Options:**

a. Le coût du programme par élève
b. L'évolution des scores de lecture dans des écoles similaires sans le programme
c. Le nombre d'heures de formation des enseignants
d. Les opinions des parents sur le programme

**Réponse correcte:** b

**Explication:**

Un groupe contrôle est essentiel. Les scores auraient peut-être augmenté de toute façon (maturation, autres facteurs). Comparer avec des écoles similaires permet d'isoler l'effet du programme.

**Points:** 1

---

### Question 137 (ID: causal-5)

**Type:** Choix multiple

**Question:**

Une entreprise affirme que son nouveau complément alimentaire améliore la mémoire. Dans leur étude, 80% des participants qui ont pris le complément pendant 3 mois ont déclaré avoir une meilleure mémoire.

Quel serait le meilleur moyen de vérifier cette affirmation ?

**Options:**

a. Comparer avec un groupe qui a pris un placebo
b. Augmenter le nombre de participants
c. Prolonger l'étude à 6 mois
d. Demander aux participants de tenir un journal

**Réponse correcte:** a

**Explication:**

Un groupe placebo est essentiel pour contrôler l'effet placebo (amélioration subjective due aux attentes). Sans contrôle, impossible de savoir si c'est le complément ou les attentes qui améliorent la mémoire perçue.

**Points:** 1

---

### Question 138 (ID: causal-6)

**Type:** Choix multiple

**Question:**

Un médecin prescrit un traitement à un patient. Après 2 semaines, le patient se sent mieux et le médecin conclut que le traitement fonctionne.

Quelle est la principale limite de cette conclusion ?

**Options:**

a. 2 semaines, c'est trop court
b. On ne sait pas si le patient aurait guéri spontanément
c. Un seul patient n'est pas suffisant
d. Le patient pourrait mentir

**Réponse correcte:** b

**Explication:**

La principale limite est l'absence de groupe contrôle. Beaucoup de conditions s'améliorent spontanément (régression vers la moyenne). Impossible de savoir si c'est le traitement ou la guérison naturelle.

**Points:** 1

---

## Effets de Cadrage (10 items)

**Points:** 3 | **Temps:** 8 min

### Question 139 (ID: frame-1a)

**Type:** Choix multiple

**Question:**

Vous consultez les statistiques d'emploi d'une région. Vous apprenez que dans cette région, **92% de la population active a un emploi**.

Comment évaluez-vous la situation de l'emploi dans cette région ?

**Options:**

a. Très favorable
b. Favorable
c. Légèrement favorable
d. Légèrement défavorable
e. Défavorable
f. Très défavorable

**Réponse correcte:** b

**Explication:**

Un produit décrit comme '95% efficace' et '5% d'échec' est mathématiquement identique. Les personnes rationnelles ne devraient pas être influencées par le cadrage positif ou négatif.

**Points:** 0

---

### Question 140 (ID: frame-1b)

**Type:** Choix multiple

**Question:**

Vous consultez les statistiques d'emploi d'une région. Vous apprenez que dans cette région, **8% de la population active est au chômage**.

Comment évaluez-vous la situation de l'emploi dans cette région ?

**Options:**

a. Favorable
b. Très favorable
c. Légèrement favorable
d. Légèrement défavorable
e. Défavorable
f. Très défavorable

**Réponse correcte:** a

**Explication:**

Un produit décrit comme '95% efficace' et '5% d'échec' est mathématiquement identique. Le cadrage négatif ne devrait pas changer votre évaluation rationnelle.

**Points:** 0.6

---

### Question 141 (ID: frame-2a)

**Type:** Choix multiple

**Question:**

Imaginez qu'une nouvelle maladie menace 600 personnes. Deux traitements sont proposés :

**Traitement A** : 200 personnes seront sauvées avec certitude
**Traitement B** : 1/3 de chances de sauver les 600 personnes, 2/3 de chances de ne sauver personne

Quel traitement choisissez-vous ?

**Options:**

a. Traitement A
b. Traitement B

**Explication:**

Cette question teste l'effet de cadrage (framing effect). La formulation en termes de vies sauvées influence vers l'option certaine (aversion au risque en contexte de gain).

**Points:** 0

---

### Question 142 (ID: frame-2b)

**Type:** Choix multiple

**Question:**

Imaginez qu'une nouvelle maladie menace 600 personnes. Deux traitements sont proposés :

**Traitement A** : 400 personnes mourront avec certitude
**Traitement B** : 1/3 de chances que personne ne meure, 2/3 de chances que 600 personnes meurent

Quel traitement choisissez-vous ?

**Options:**

a. Traitement A
b. Traitement B

**Explication:**

Cette question est mathématiquement équivalente à la version 'cadre gain' mais formulée en termes de pertes. Les personnes rationnelles devraient faire le même choix dans les deux cas.

**Points:** 0.6

---

### Question 143 (ID: frame-3a)

**Type:** Choix multiple

**Question:**

Un nouveau modèle de voiture a été testé. Le rapport indique que le véhicule **fonctionne correctement 94% du temps**.

Quelle est votre impression de la fiabilité de ce véhicule ?

**Options:**

a. Très favorable
b. Favorable
c. Légèrement favorable
d. Légèrement défavorable
e. Défavorable
f. Très défavorable

**Réponse correcte:** b

**Explication:**

Un véhicule qui 'fonctionne 94% du temps' est identique à un véhicule qui 'dysfonctionne 6% du temps'. Le cadrage positif ne devrait pas influencer une évaluation rationnelle.

**Points:** 0

---

### Question 144 (ID: frame-3b)

**Type:** Choix multiple

**Question:**

Un nouveau modèle de voiture a été testé. Le rapport indique que le véhicule **présente des dysfonctionnements 6% du temps**.

Quelle est votre impression de la fiabilité de ce véhicule ?

**Options:**

a. Favorable
b. Très favorable
c. Légèrement favorable
d. Légèrement défavorable
e. Défavorable
f. Très défavorable

**Réponse correcte:** a

**Explication:**

Cette formulation négative décrit exactement la même réalité que la version positive (94% de fonctionnement). Les personnes rationnelles évaluent la fiabilité indépendamment du cadrage.

**Points:** 0.6

---

### Question 145 (ID: frame-4a)

**Type:** Choix multiple

**Question:**

Une compagnie aérienne annonce que **99,7% de ses vols arrivent sans incident de sécurité**.

Que pensez-vous de la sécurité de cette compagnie ?

**Options:**

a. Très sûre
b. Sûre
c. Légèrement sûre
d. Légèrement risquée
e. Risquée
f. Très risquée

**Réponse correcte:** b

**Explication:**

Une viande décrite comme '75% maigre' est identique à '25% de matière grasse'. Le cadrage positif ne devrait pas influencer votre perception de la qualité.

**Points:** 0

---

### Question 146 (ID: frame-4b)

**Type:** Choix multiple

**Question:**

Une compagnie aérienne annonce que **0,3% de ses vols connaissent un incident de sécurité**.

Que pensez-vous de la sécurité de cette compagnie ?

**Options:**

a. Sûre
b. Très sûre
c. Légèrement sûre
d. Légèrement risquée
e. Risquée
f. Très risquée

**Réponse correcte:** a

**Explication:**

Cette formulation en termes de matière grasse décrit le même produit que '75% maigre'. Une évaluation rationnelle devrait être identique dans les deux cas.

**Points:** 0.6

---

### Question 147 (ID: frame-5a)

**Type:** Choix multiple

**Question:**

Un nouveau médicament est testé. Les résultats montrent que **85% des patients voient leur état s'améliorer**.

Que pensez-vous de l'efficacité de ce médicament ?

**Options:**

a. Très efficace
b. Efficace
c. Moyennement efficace
d. Peu efficace
e. Inefficace
f. Totalement inefficace

**Réponse correcte:** b

**Explication:**

Un programme avec '90% de réussite' est identique à '10% d'échec'. Le cadrage positif ne devrait pas affecter votre jugement sur son efficacité.

**Points:** 0

---

### Question 148 (ID: frame-5b)

**Type:** Choix multiple

**Question:**

Un nouveau médicament est testé. Les résultats montrent que **15% des patients ne voient aucune amélioration**.

Que pensez-vous de l'efficacité de ce médicament ?

**Options:**

a. Très efficace
b. Efficace
c. Moyennement efficace
d. Peu efficace
e. Inefficace
f. Totalement inefficace

**Réponse correcte:** b

**Explication:**

Cette formulation en termes d'échec décrit le même taux de succès (90%). Les personnes rationnelles résistent à l'effet de cadrage et évaluent objectivement.

**Points:** 0.6

---

## Sensibilité à la Valeur Espérée (6 items)

**Points:** 2.52 | **Temps:** 3 min

### Question 149 (ID: ev-2)

**Type:** Choix multiple

**Question:**

Quel pari préférez-vous ?

**Pari A** : 15% de chances de gagner 150€ et 85% de chances de gagner 8€
**Pari B** : 15% de chances de gagner 40€ et 85% de chances de gagner 10€

**Options:**

a. Pari A
b. Pari B

**Réponse correcte:** a

**Explication:**

VE(A) = 0.15×150 + 0.85×8 = 29€. VE(B) = 0.15×40 + 0.85×10 = 14,50€. Pari A est optimal.

**Points:** 0.42

---

### Question 150 (ID: ev-3)

**Type:** Choix multiple

**Question:**

Quel pari préférez-vous ?

**Pari A** : 10% de chances de gagner 200€ et 90% de chances de gagner 12€
**Pari B** : 10% de chances de gagner 60€ et 90% de chances de gagner 15€

**Options:**

a. Pari A
b. Pari B

**Réponse correcte:** a

**Explication:**

VE(A) = 0.10×200 + 0.90×12 = 30,80€. VE(B) = 0.10×60 + 0.90×15 = 19,50€. Pari A est optimal.

**Points:** 0.42

---

### Question 151 (ID: ev-4)

**Type:** Choix multiple

**Question:**

Quel pari préférez-vous ?

**Pari A** : 100% de chances de gagner 0,75€
**Pari B** : 40% de chances de gagner 2,50€ et 60% de chances de ne rien gagner

**Options:**

a. Pari A
b. Pari B

**Réponse correcte:** b

**Explication:**

VE(A) = 0,75€. VE(B) = 0.40×2,50 = 1,00€. Pari B est optimal.

**Points:** 0.42

---

### Question 152 (ID: ev-6)

**Type:** Choix multiple

**Question:**

Quel pari préférez-vous ?

**Pari A** : 20% de chances de gagner 500€ et 80% de chances de gagner 20€
**Pari B** : 20% de chances de gagner 100€ et 80% de chances de gagner 80€

**Options:**

a. Pari A
b. Pari B

**Réponse correcte:** a

**Explication:**

VE(A) = 0.20×500 + 0.80×20 = 116€. VE(B) = 0.20×100 + 0.80×80 = 84€. Pari A est optimal.

**Points:** 0.42

---

### Question 153 (ID: ev-7)

**Type:** Choix multiple

**Question:**

Quel pari préférez-vous ?

**Pari A** : 50% de chances de gagner 300€ et 50% de chances de gagner 100€
**Pari B** : 50% de chances de gagner 250€ et 50% de chances de gagner 150€

**Options:**

a. Pari A
b. Pari B

**Réponse correcte:** b

**Explication:**

VE(A) = 0.50×300 + 0.50×100 = 200€. VE(B) = 0.50×250 + 0.50×150 = 200€. Égalité, mais B a moins de variance.

**Points:** 0.42

---

### Question 154 (ID: ev-10)

**Type:** Choix multiple

**Question:**

Quel pari préférez-vous ?

**Pari A** : 60% de chances de gagner 200€ et 40% de chances de gagner 50€
**Pari B** : 60% de chances de gagner 150€ et 40% de chances de gagner 100€

**Options:**

a. Pari A
b. Pari B

**Réponse correcte:** a

**Explication:**

VE(A) = 0.60×200 + 0.40×50 = 140€. VE(B) = 0.60×150 + 0.40×100 = 130€. Pari A est optimal.

**Points:** 0.42

---

## Coûts Irrécupérables (4 items)

**Points:** 3 | **Temps:** 4 min

### Question 155 (ID: sunk-1)

**Type:** Choix multiple

**Question:**

Vous avez acheté un billet de concert à 80€. Le concert commence dans 1 heure, et vous tombez malade (fièvre, fatigue). Le concert ne vous remboursera pas, et il est trop tard pour vendre le billet.

Que devriez-vous faire ?

**Options:**

a. Aller au concert quand même pour ne pas perdre les 80€
b. Rester chez vous vous reposer, les 80€ sont déjà perdus

**Réponse correcte:** b

**Explication:**

Les 80€ sont un coût irrécupérable (sunk cost). La décision rationnelle considère uniquement le futur : aller malade au concert vs rester chez vous pour guérir. Le passé (les 80€ déjà dépensés) ne doit pas influencer cette décision. Il est trop tard pour vendre le billet, donc cette option n'est pas disponible.

**Points:** 0.75

---

### Question 156 (ID: sunk-2)

**Type:** Choix multiple

**Question:**

Vous avez investi 10 000€ dans un projet depuis 6 mois. Après analyse, vous réalisez que le projet ne sera jamais rentable. Vous pouvez soit :

• Continuer et perdre 5 000€ de plus avant l'échec
• Arrêter maintenant et perdre seulement les 10 000€ déjà investis

Que faire ?

**Options:**

a. Arrêter immédiatement pour limiter les pertes
b. Continuer, sinon les 10 000€ auront été gaspillés pour rien
c. Continuer encore 3 mois pour être sûr

**Réponse correcte:** a

**Explication:**

Arrêter est rationnel. Les 10 000€ sont perdus quoi qu'il arrive (sunk cost). Continuer signifie perdre 15 000€ au total au lieu de 10 000€.

**Points:** 0.75

---

### Question 157 (ID: sunk-3)

**Type:** Choix multiple

**Question:**

Vous avez passé 3 heures à cuisiner un plat élaboré. En le goûtant, vous réalisez qu'il est complètement raté (BEAUCOUP trop salé, absolument immangeable, impossible à corriger). Vous pourriez commander à manger (15€, délicieux).

Que faire ?

**Options:**

a. Manger le plat raté pour ne pas gâcher les 3 heures de travail
b. Commander à manger, les 3 heures sont déjà perdues

**Réponse correcte:** b

**Explication:**

Les 3 heures de cuisine sont un sunk cost. La décision rationnelle considère uniquement le futur : se forcer à manger quelque chose d'immangeable vs payer 15€ pour un bon repas. Le temps déjà passé ne doit pas influencer cette décision. Le plat étant impossible à corriger, cette option n'est pas disponible.

**Points:** 0.75

---

### Question 158 (ID: sunk-4)

**Type:** Choix multiple

**Question:**

Vous avez acheté un abonnement de gym annuel (600€, non remboursable). Après 2 mois, vous réalisez que vous détestez cette salle (loin, équipement médiocre). Une nouvelle salle a ouvert près de chez vous (50€/mois).

Que faire ?

**Options:**

a. Continuer avec l'ancienne salle pour rentabiliser les 600€
b. Changer pour la nouvelle salle, les 600€ sont déjà perdus
c. Alterner entre les deux salles

**Réponse correcte:** b

**Explication:**

Changer est rationnel. Les 600€ sont perdus (sunk cost). Le choix est : continuer à détester pendant 10 mois vs payer 500€ supplémentaires pour 10 mois agréables.

**Points:** 0.75

---

