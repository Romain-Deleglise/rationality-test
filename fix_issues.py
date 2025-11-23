#!/usr/bin/env python3
import json

print("Lecture du fichier test-complet.json...")
with open('/home/user/rationality-test/src/data/test-complet.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

corrections = []

# Parcourir tous les modules
for module in data['modules']:
    if module['id'] == 'argument-eval':
        print(f"\n=== Module: {module['name']} ===")

        for q in module['questions']:
            # Corriger les questions Partie A : correct devrait être null (pas de bonne réponse)
            if q['id'].endswith('a'):
                if q.get('correct') is not None:
                    print(f"✓ Correction {q['id']}: correct: {q['correct']} → null")
                    q['correct'] = None
                    corrections.append(f"{q['id']}: Suppression de la réponse 'correcte' (mesure opinion préalable)")

                    # Aussi corriger l'explication pour arg-eval-2a
                    if q['id'] == 'arg-eval-2a':
                        old_exp = q.get('explanation', '')
                        new_exp = "Cette question mesure votre opinion préalable pour détecter le biais de croyance."
                        if old_exp != new_exp:
                            print(f"✓ Correction explication {q['id']}")
                            q['explanation'] = new_exp
                            corrections.append(f"{q['id']}: Correction de l'explication")

    # Corriger dysfunc-9
    elif module['id'] == 'dysfunctional-beliefs':
        print(f"\n=== Module: {module['name']} ===")

        for q in module['questions']:
            if q['id'] == 'dysfunc-9':
                old_exp = q.get('explanation', '')
                new_exp = "Cette croyance suggère un déterminisme psychologique irréaliste et ignore la capacité humaine au changement, à l'adaptation et à la résilience. Les recherches en psychologie montrent que les personnes peuvent modifier leurs réactions émotionnelles et comportementales par la thérapie, l'apprentissage et l'expérience. Bien que les traumatismes passés puissent avoir des effets durables, leur impact peut évoluer avec le temps et le traitement approprié."

                if old_exp != new_exp:
                    print(f"✓ Correction explication {q['id']}")
                    q['explanation'] = new_exp
                    corrections.append(f"{q['id']}: Correction de l'explication (déterminisme psychologique)")

print(f"\n{'='*80}")
print(f"RÉSUMÉ DES CORRECTIONS")
print(f"{'='*80}")

if corrections:
    print(f"\n{len(corrections)} correction(s) appliquée(s) :")
    for i, corr in enumerate(corrections, 1):
        print(f"  {i}. {corr}")

    # Sauvegarder les modifications
    print(f"\nSauvegarde du fichier...")
    with open('/home/user/rationality-test/src/data/test-complet.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("✓ Fichier sauvegardé avec succès !")
else:
    print("\nAucune correction nécessaire.")

print(f"\n{'='*80}")
