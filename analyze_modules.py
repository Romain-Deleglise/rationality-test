#!/usr/bin/env python3
import json

# Lire le fichier test-complet.json
with open('/home/user/rationality-test/src/data/test-complet.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Modules à vérifier
modules_to_check = [
    "superstition",
    "anti-science",
    "conspiracy",
    "dysfunctional",
    "arg-eval",
    "framing"
]

print("=" * 80)
print("MODULES SUSPECTS - ANALYSE")
print("=" * 80)

for module in data['modules']:
    module_id = module.get('id', '')
    module_name = module.get('name', '')

    # Vérifier si c'est un module suspect
    is_suspect = any(suspect in module_id for suspect in modules_to_check)

    if is_suspect:
        print(f"\n{'=' * 80}")
        print(f"MODULE: {module_name} (ID: {module_id})")
        print(f"{'=' * 80}")
        print(f"Points: {module.get('points', 'N/A')}")
        print(f"Nombre de questions: {len(module.get('questions', []))}")
        print(f"\nQuestions:")

        for i, q in enumerate(module.get('questions', []), 1):
            print(f"\n--- Question {i} (ID: {q.get('id', 'N/A')}) ---")
            print(f"Type: {q.get('type', 'N/A')}")
            print(f"Points: {q.get('points', 'N/A')}")

            # Afficher le texte de la question (tronqué si trop long)
            text = q.get('text', 'N/A')
            if len(text) > 150:
                print(f"Texte: {text[:150]}...")
            else:
                print(f"Texte: {text}")

            # Afficher les options
            options = q.get('options', [])
            if options:
                print("Options:")
                for j, opt in enumerate(options):
                    marker = " ← CORRECT" if j == q.get('correct') else ""
                    print(f"  {j}. {opt}{marker}")

            # Vérifications de cohérence
            print("\nVÉRIFICATIONS:")

            # Vérifier si correct est défini
            correct = q.get('correct')
            if correct is None:
                print("  ⚠️ ATTENTION: 'correct' est null (peut être intentionnel)")
            elif isinstance(correct, int):
                if correct < 0 or correct >= len(options):
                    print(f"  ❌ ERREUR: 'correct' ({correct}) hors limites (0-{len(options)-1})")
                else:
                    print(f"  ✓ 'correct' est valide: index {correct}")

            # Vérifier l'explication
            explanation = q.get('explanation', '')
            if not explanation:
                print("  ⚠️ ATTENTION: Pas d'explication fournie")
            else:
                print(f"  ✓ Explication présente ({len(explanation)} caractères)")

            # Vérifier les points
            points = q.get('points', 0)
            if points == 0:
                print("  ⚠️ ATTENTION: La question vaut 0 point")
            elif points < 0:
                print(f"  ❌ ERREUR: Points négatifs ({points})")
            else:
                print(f"  ✓ Points valides: {points}")

print("\n" + "=" * 80)
print("FIN DE L'ANALYSE")
print("=" * 80)
