#!/usr/bin/env python3
"""
Script pour générer le fichier questions-test-complet-updated.md à partir de test-complet.json
"""

import json

def format_question(question, question_num):
    """Formate une question en Markdown"""
    md = f"### Question {question_num} (ID: {question['id']})\n\n"
    md += f"**Type:** {'Choix multiple' if question['type'] == 'multiple-choice' else question['type'].title()}\n\n"
    md += "**Question:**\n\n"
    md += f"{question['text']}\n\n"

    if question['type'] == 'likert':
        md += "**Échelle:** 1 (Pas du tout d'accord) à 7 (Tout à fait d'accord)\n\n"
        if 'correct' in question and question['correct'] is not None:
            md += f"**Réponse rationnelle:** {question['correct']}\n\n"
        if question.get('reverse', False):
            md += "**Note:** Question inversée\n\n"
    elif 'options' in question:
        md += "**Options:**\n\n"
        for i, option in enumerate(question['options']):
            md += f"{chr(97 + i)}. {option}\n"
        md += "\n"

        if 'correct' in question and question['correct'] is not None:
            correct_letter = chr(97 + question['correct'])
            md += f"**Réponse correcte:** {correct_letter}\n\n"

    if 'explanation' in question:
        md += "**Explication:**\n\n"
        md += f"{question['explanation']}\n\n"

    md += f"**Points:** {question.get('points', 0)}\n\n"

    # Informations supplémentaires pour le framing
    if 'pairId' in question:
        md += f"**Paire:** {question['pairId']} ({question.get('framingType', '')})\n\n"

    md += "---\n\n"
    return md

def generate_module(module):
    """Génère le Markdown pour un module complet"""
    md = f"## {module['name']}\n\n"
    md += f"**Points:** {module['points']} | **Temps:** {module['time']} min\n\n"

    for i, question in enumerate(module['questions'], 1):
        md += format_question(question, i)

    return md

def main():
    # Charger le fichier JSON
    with open('/home/user/rationality-test/src/data/test-complet.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Générer le Markdown
    md = "# Test de Rationalité - Questions Complètes (Version Mise à Jour)\n\n"
    md += f"**Version:** {data['version']}\n"
    md += f"**Points totaux:** {data['totalPoints']}\n"
    md += f"**Temps estimé:** {data['estimatedTime']} minutes\n\n"
    md += "---\n\n"

    for module in data['modules']:
        md += generate_module(module)

    # Sauvegarder le fichier
    with open('/home/user/rationality-test/questions-test-complet-updated.md', 'w', encoding='utf-8') as f:
        f.write(md)

    print(f"✓ Fichier questions-test-complet-updated.md généré avec succès !")
    print(f"  Total modules: {len(data['modules'])}")
    print(f"  Points totaux: {data['totalPoints']}")

if __name__ == '__main__':
    main()
