#!/usr/bin/env python3
import json

with open('/home/user/rationality-test/src/data/test-complet.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 80)
print("VÉRIFICATION SÉMANTIQUE DES QUESTIONS")
print("=" * 80)

# Modules à vérifier en détail
target_modules = ['superstition', 'anti-science', 'conspiracy', 'dysfunctional-beliefs', 'argument-eval', 'framing']

for module in data['modules']:
    if module['id'] not in target_modules:
        continue

    print(f"\n{'=' * 80}")
    print(f"MODULE: {module['name']} (ID: {module['id']})")
    print(f"{'=' * 80}")

    for q in module['questions']:
        print(f"\n[{q['id']}]")
        print(f"Type: {q['type']}")
        print(f"Texte: {q['text']}")

        # Pour les questions Likert
        if q['type'] == 'likert':
            correct_val = q.get('correct')
            reverse = q.get('reverse', False)

            if correct_val == 1:
                print(f"→ Réponse correcte: 1 (Pas du tout d'accord)")
            elif correct_val == 7:
                print(f"→ Réponse correcte: 7 (Tout à fait d'accord)")
            else:
                print(f"→ Réponse correcte: {correct_val}")

            if reverse:
                print("→ Question inversée (reverse: true)")

        # Pour les questions à choix multiples
        elif q['type'] == 'multiple-choice':
            correct_idx = q.get('correct')
            options = q.get('options', [])

            if correct_idx is not None and 0 <= correct_idx < len(options):
                print(f"→ Réponse correcte: {options[correct_idx]}")
            elif correct_idx is None:
                print("→ Pas de réponse correcte définie (évaluation subjective)")

        # Afficher l'explication
        explanation = q.get('explanation', '')
        if explanation:
            print(f"\nExplication: {explanation}")
        else:
            print("\n⚠️ Pas d'explication")

        print("-" * 80)
