#!/usr/bin/env python3
"""
Script pour mettre à jour MODULES_COMPLETS_FR.json
"""

import json
import sys

def reduce_expected_value_module(data):
    """Réduit le module expected-value de 12 à 6 questions (les plus simples)"""
    if 'expected_value' in data:
        module = data['expected_value']
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

        # Mettre à jour les points (6 questions × 0.42 = 2.52, arrondi à 2.5)
        module['points'] = 2.5

        # Mettre à jour le temps estimé
        module['time'] = 4

        print(f"✓ Module 'expected_value' réduit de {original_count} à {len(module['questions'])} questions")
        print(f"  Questions conservées : {', '.join(questions_to_keep)}")
        return True
    return False

def fix_framing_scoring(data):
    """Corrige le scoring du module Effets de Cadrage avec système de paires"""
    if 'framing_effects' in data:
        module = data['framing_effects']

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

        print(f"✓ Module 'framing_effects' : système de scoring par paires vérifié ({len(pairs)} paires)")
        if changes > 0:
            print(f"  {changes} ajustements de points effectués")
        return True
    return False

def main():
    input_file = '/home/user/rationality-test/MODULES_COMPLETS_FR.json'

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        print("Début des modifications de MODULES_COMPLETS_FR.json...\n")

        # 1. Réduire le module Valeur Espérée
        reduce_expected_value_module(data)

        # 2. Corriger le scoring du module Effets de Cadrage
        fix_framing_scoring(data)

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
