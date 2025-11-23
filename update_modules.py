#!/usr/bin/env python3
"""
Script pour mettre à jour les modules du test de rationalité :
1. Réduire le module Valeur Espérée de 12 à 6 questions
2. Remplacer 'optimal' par 'correct' dans les modules de croyances
3. Corriger le scoring du module Effets de Cadrage avec système de paires
"""

import json
import sys

def reduce_expected_value_module(data):
    """Réduit le module expected-value de 12 à 6 questions (les plus simples)"""
    for module in data.get('modules', []):
        if module.get('id') == 'expected-value':
            # Questions à garder (les plus simples à calculer mentalement)
            questions_to_keep = ['ev-2', 'ev-3', 'ev-4', 'ev-6', 'ev-7', 'ev-10']

            # Filtrer les questions
            original_count = len(module['questions'])
            module['questions'] = [
                q for q in module['questions']
                if q['id'] in questions_to_keep
            ]

            # Mettre à jour le nom du module
            module['name'] = "Sensibilité à la Valeur Espérée (6 items)"

            # Mettre à jour les points (6 questions × 0.42 = 2.52)
            module['points'] = 2.52

            # Mettre à jour le temps estimé (réduire proportionnellement)
            module['time'] = 3

            print(f"✓ Module 'expected-value' réduit de {original_count} à {len(module['questions'])} questions")
            print(f"  Questions conservées : {', '.join(questions_to_keep)}")
            return True
    return False

def replace_optimal_with_correct(data):
    """Remplace 'optimal' par 'correct' dans tous les modules de croyances"""
    modules_with_optimal = ['superstition', 'anti-science', 'conspiracy', 'dysfunctional-beliefs', 'argument-eval']
    count = 0

    for module in data.get('modules', []):
        if module.get('id') in modules_with_optimal:
            for question in module.get('questions', []):
                if 'optimal' in question:
                    question['correct'] = question.pop('optimal')
                    count += 1

    if count > 0:
        print(f"✓ Remplacé 'optimal' par 'correct' dans {count} questions")
    return count > 0

def fix_framing_scoring(data):
    """Corrige le scoring du module Effets de Cadrage avec système de paires"""
    for module in data.get('modules', []):
        if module.get('id') == 'framing':
            # Le scoring par paires : 0 point pour la première question de chaque paire,
            # 0.6 point pour la deuxième si réponse cohérente avec la première

            pairs = {}
            for question in module.get('questions', []):
                pair_id = question.get('pairId')
                if pair_id:
                    if pair_id not in pairs:
                        pairs[pair_id] = []
                    pairs[pair_id].append(question)

            # Vérifier et ajuster le scoring
            changes = 0
            for pair_id, questions in pairs.items():
                if len(questions) == 2:
                    # La première question de la paire donne 0 point
                    if questions[0].get('points') != 0:
                        questions[0]['points'] = 0
                        changes += 1

                    # La deuxième question donne 0.6 point si cohérent
                    if questions[1].get('points') != 0.6:
                        questions[1]['points'] = 0.6
                        changes += 1

            # Mettre à jour les points totaux du module (5 paires × 0.6 = 3.0)
            module['points'] = 3.0

            print(f"✓ Module 'framing' : système de scoring par paires vérifié ({len(pairs)} paires)")
            if changes > 0:
                print(f"  {changes} ajustements de points effectués")
            return True
    return False

def update_total_points(data):
    """Recalcule les points totaux du test"""
    total_points = sum(module.get('points', 0) for module in data.get('modules', []))
    old_total = data.get('totalPoints', 0)
    data['totalPoints'] = round(total_points, 2)
    print(f"✓ Points totaux mis à jour : {old_total} → {data['totalPoints']}")

def main():
    # Charger le fichier JSON
    input_file = '/home/user/rationality-test/src/data/test-complet.json'

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        print("Début des modifications...\n")

        # 1. Réduire le module Valeur Espérée
        reduce_expected_value_module(data)

        # 2. Remplacer optimal par correct
        replace_optimal_with_correct(data)

        # 3. Corriger le scoring du module Effets de Cadrage
        fix_framing_scoring(data)

        # 4. Recalculer les points totaux
        update_total_points(data)

        # Sauvegarder le fichier modifié
        with open(input_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"\n✓ Fichier {input_file} mis à jour avec succès !")
        return 0

    except Exception as e:
        print(f"✗ Erreur : {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
