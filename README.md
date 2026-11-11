# Sport Today

Micro-app (PWA) de séances avec chrono automatique : préparation, exercices, repos, tours et changement de côté s'enchaînent tout seuls. Tout est éditable. Aucune dépendance, aucun build, fonctionne hors-ligne.

Contenu par défaut :
- **Muscu** (lun / mer / ven) : échauffement, bloc 1, bloc 2, abdos.
- **Pilates** (mar / jeu / sam / dim) : éveil, centre (abdos Pilates), gainage, étirements, relâchement.

## Installer sur le téléphone

1. Héberger le dossier en HTTPS. Avec GitHub Pages : *Settings → Pages → Deploy from a branch*, choisir la branche et `/ (root)`.
2. Ouvrir l'adresse sur le téléphone :
   - iPhone (Safari) : *Partager → Sur l'écran d'accueil*
   - Android (Chrome) : *⋮ → Installer l'application*

Après la première ouverture, l'app marche sans réseau.

## Pendant la séance

| Élément | Rôle |
| --- | --- |
| Anneau | temps restant (couleur de la séance = effort, bleu = repos, jaune = préparation / changement de côté) |
| ✓ | exercice en répétitions : l'écran affiche juste le nombre et attend que tu valides (toucher l'anneau marche aussi) |
| ⏸ / ▶ | pause sur les exercices chronométrés |
| ⏭ / ⏮ | passer / revenir |
| +15″ | rallonger le repos en cours |
| ✕ | pause avec : quitter, reprendre, terminer (enregistre la séance) |

Bips sur les 3 dernières secondes, vibration (Android), voix optionnelle, écran maintenu allumé.

## Éditer

Ouvrir une séance, puis toucher :
- **le titre ou les jours** : nom, jours, icône, couleur, dupliquer, supprimer ;
- **un bloc** : tours, repos entre exos (0 = enchaîner), repos entre tours, repos après le bloc ;
- **un exercice** : nom, reps ou temps, valeur, par côté, monter / descendre, dupliquer, supprimer ;
- **+** pour ajouter un exercice ou un bloc.

Supprimer un bloc ou une séance demande deux appuis.

## Suivi

Bouton calendrier en haut de l'accueil (ou toucher la semaine) :
- **vert ✓** : au moins une séance faite ce jour-là ;
- **croix ✕** : rien de fait (à partir du premier jour d'utilisation) ;
- série de jours d'affilée, nombre de jours faits / ratés et temps total du mois, liste des séances.

Toucher un jour pour ajouter une séance oubliée ou supprimer une entrée.
L'historique garde le nom et la couleur de chaque séance : modifier ou supprimer un programme ne change rien au suivi.

## Réglages

Son, vibration, voix, durée de préparation, export / import JSON, retour au programme par défaut.

## Développement

```sh
python3 -m http.server 8000
```

Fichiers : `index.html`, `app.css`, `app.js`, `sw.js`, `manifest.webmanifest`, `icons/`, `fonts/` (Barlow, licence OFL).
Après une modification, changer `VERSION` dans `sw.js` pour que les téléphones récupèrent la nouvelle version.
