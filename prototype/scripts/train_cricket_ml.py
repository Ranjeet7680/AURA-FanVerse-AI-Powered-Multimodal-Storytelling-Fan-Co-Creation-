"""
Cricket ML Training & Dataset Processing Pipeline for AURA FanVerse
Processes:
- 1,761 Cricsheet Match JSONs (Men's & Women's T20, ODI, Multi-day)
- 90,308 Players Cleaned CSV (Career stats across all formats)
- 17,385 Players Demographic/Profile CSV (Photos, nationalities, styles)
Trains:
- Win Probability Logistic Regression & Feature Importance Model
- Projected First Innings Score Regressor
- Team Power / ELO Ratings
- Player Impact Index & Form Model
Exports:
- prototype/public/data/ml_models.json
- prototype/public/data/players_top.json
- prototype/public/data/recent_matches.json
- prototype/public/data/analytics_summary.json
"""

import os
import glob
import json
import math
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.metrics import accuracy_score, r2_score
from collections import defaultdict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"[*] Starting Cricket ML Pipeline...")
print(f"[*] Data Directory: {DATA_DIR}")
print(f"[*] Output Directory: {OUTPUT_DIR}")

# ---------------------------------------------------------------------------
# 1. Load Player Metadata & Stats
# ---------------------------------------------------------------------------
players_meta_path = os.path.join(DATA_DIR, "csv", "players_data_with_all_info.csv")
players_stats_path = os.path.join(DATA_DIR, "csv", "Cricket_Players_Cleaned.csv")

player_profiles = {}
if os.path.exists(players_meta_path):
    print("[*] Parsing player profile metadata...")
    df_meta = pd.read_csv(players_meta_path, low_memory=False)
    for _, row in df_meta.iterrows():
        name = str(row.get('fullname', '')).strip()
        if not name or name == 'nan':
            name = f"{str(row.get('firstname', '')).strip()} {str(row.get('lastname', '')).strip()}".strip()
        if name:
            player_profiles[name.lower()] = {
                'id': int(row.get('id', 0)) if pd.notna(row.get('id')) else 0,
                'name': name,
                'image': str(row.get('image_path', '')) if pd.notna(row.get('image_path')) else '',
                'country': str(row.get('country_name', '')) if pd.notna(row.get('country_name')) else '',
                'country_flag': str(row.get('country_image_path', '')) if pd.notna(row.get('country_image_path')) else '',
                'gender': str(row.get('gender', 'm')),
                'batting_style': str(row.get('battingstyle', 'Right-hand bat')),
                'bowling_style': str(row.get('bowlingstyle', 'Right-arm medium')),
                'position': str(row.get('position', 'Allrounder')),
                'dob': str(row.get('dateofbirth', ''))
            }
    print(f"    Loaded {len(player_profiles):,} player profiles with images.")

# Process Career Stats from 90k dataset
top_players = []
if os.path.exists(players_stats_path):
    print("[*] Processing player career statistics (90k records)...")
    df_stats = pd.read_csv(players_stats_path, low_memory=False)
    
    # We want top players by career international + league runs/wickets
    for _, row in df_stats.iterrows():
        p_name = str(row.get('Full name', '')).strip()
        if not p_name or p_name == 'nan':
            p_name = str(row.get('NAME', '')).strip()
        if not p_name or p_name == 'nan':
            continue
            
        def safe_float(val, default=0.0):
            try:
                if pd.isna(val): return default
                v = str(val).replace('-', '0').replace('+', '').strip()
                return float(v)
            except:
                return default

        def safe_int(val, default=0):
            try:
                if pd.isna(val): return default
                v = str(val).replace('-', '0').replace('+', '').strip()
                return int(float(v))
            except:
                return default

        t20_runs = safe_int(row.get('BATTING_T20Is_Runs', 0)) + safe_int(row.get('BATTING_T20s_Runs', 0))
        odi_runs = safe_int(row.get('BATTING_ODIs_Runs', 0)) + safe_int(row.get('BATTING_List A_Runs', 0))
        test_runs = safe_int(row.get('BATTING_Tests_Runs', 0))
        total_runs = t20_runs + odi_runs + test_runs

        t20_wkts = safe_int(row.get('BOWLING_T20Is_Wkts', 0)) + safe_int(row.get('BOWLING_T20s_Wkts', 0))
        odi_wkts = safe_int(row.get('BOWLING_ODIs_Wkts', 0)) + safe_int(row.get('BOWLING_List A_Wkts', 0))
        test_wkts = safe_int(row.get('BOWLING_Tests_Wkts', 0))
        total_wkts = t20_wkts + odi_wkts + test_wkts

        if total_runs > 1000 or total_wkts > 50:
            meta = player_profiles.get(p_name.lower(), {})
            country = meta.get('country') or str(row.get('COUNTRY', 'Unknown'))
            image = meta.get('image', '')
            role = meta.get('position') or ('Allrounder' if total_runs > 1500 and total_wkts > 60 else ('Bowler' if total_wkts > 100 else 'Batsman'))
            
            # Composite Impact Index
            impact_score = round((total_runs * 0.15) + (total_wkts * 12.5) + (safe_float(row.get('BATTING_T20Is_SR', 120)) * 0.4), 1)

            top_players.append({
                'name': p_name,
                'country': country,
                'role': role,
                'image': image,
                'batting_style': meta.get('batting_style', str(row.get('Batting style', 'Right-hand bat'))),
                'bowling_style': meta.get('bowling_style', str(row.get('Bowling style', 'Right-arm medium'))),
                'total_runs': total_runs,
                'total_wickets': total_wkts,
                't20_runs': t20_runs,
                't20_wickets': t20_wkts,
                'odi_runs': odi_runs,
                'odi_wickets': odi_wkts,
                'test_runs': test_runs,
                'test_wickets': test_wkts,
                'odi_avg': safe_float(row.get('BATTING_ODIs_Ave', 0)),
                't20_sr': safe_float(row.get('BATTING_T20Is_SR', 0)),
                'bowling_econ': safe_float(row.get('BOWLING_T20Is_Econ', 7.5)),
                'impact_score': impact_score
            })

    # Sort by impact score
    top_players.sort(key=lambda x: x['impact_score'], reverse=True)
    top_players = top_players[:400]
    print(f"    Selected top {len(top_players)} prominent players with career analytics.")

# ---------------------------------------------------------------------------
# 2. Ingest Match JSONs from All Directories
# ---------------------------------------------------------------------------
print("[*] Scanning and extracting match JSON files...")
all_json_files = glob.glob(os.path.join(DATA_DIR, "**", "*.json"), recursive=True)
print(f"    Found {len(all_json_files):,} candidate match JSON files.")

match_dataset = []
team_stats = defaultdict(lambda: {'matches': 0, 'wins': 0, 'runs_scored': 0, 'overs_faced': 0.1, 'runs_conceded': 0, 'overs_bowled': 0.1})
venue_stats = defaultdict(lambda: {'matches': 0, 'total_first_inns_runs': 0, 'bat_first_wins': 0, 'chase_wins': 0})
processed_matches_sample = []

seen_match_ids = set()

for file_path in all_json_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        info = data.get('info', {})
        teams = info.get('teams', [])
        if len(teams) < 2:
            continue
            
        match_id = os.path.splitext(os.path.basename(file_path))[0]
        if match_id in seen_match_ids:
            continue
        seen_match_ids.add(match_id)

        team1, team2 = teams[0], teams[1]
        gender = info.get('gender', 'male')
        match_type = info.get('match_type', 'T20')
        venue = info.get('venue', 'International Cricket Stadium')
        city = info.get('city', 'Unknown')
        dates = info.get('dates', ['2026-09-01'])
        event = info.get('event', {}).get('name', 'Championship Series')
        
        toss = info.get('toss', {})
        toss_winner = toss.get('winner', team1)
        toss_decision = toss.get('decision', 'bat')
        
        outcome = info.get('outcome', {})
        winner = outcome.get('winner')
        by = outcome.get('by', {})
        margin_str = ""
        if 'runs' in by:
            margin_str = f"{by['runs']} runs"
        elif 'wickets' in by:
            margin_str = f"{by['wickets']} wickets"
        elif outcome.get('result'):
            margin_str = outcome.get('result')
            
        pom = info.get('player_of_match', [''])[0] if info.get('player_of_match') else ''

        innings_list = data.get('innings', [])
        inns1_runs, inns1_wickets, inns1_overs = 0, 0, 0
        inns2_runs, inns2_wickets, inns2_overs = 0, 0, 0
        inns1_team, inns2_team = team1, team2

        if len(innings_list) >= 1:
            inns1 = innings_list[0]
            inns1_team = inns1.get('team', team1)
            inns1_overs_data = inns1.get('overs', [])
            inns1_overs = len(inns1_overs_data)
            for ov in inns1_overs_data:
                for deliv in ov.get('deliveries', []):
                    inns1_runs += deliv.get('runs', {}).get('total', 0)
                    if 'wickets' in deliv:
                        inns1_wickets += len(deliv.get('wickets', []))

        if len(innings_list) >= 2:
            inns2 = innings_list[1]
            inns2_team = inns2.get('team', team2)
            inns2_overs_data = inns2.get('overs', [])
            inns2_overs = len(inns2_overs_data)
            for ov in inns2_overs_data:
                for deliv in ov.get('deliveries', []):
                    inns2_runs += deliv.get('runs', {}).get('total', 0)
                    if 'wickets' in deliv:
                        inns2_wickets += len(deliv.get('wickets', []))

        # Update team stats
        if winner:
            team_stats[winner]['wins'] += 1
        team_stats[team1]['matches'] += 1
        team_stats[team2]['matches'] += 1
        
        if inns1_team == team1:
            team_stats[team1]['runs_scored'] += inns1_runs
            team_stats[team1]['overs_faced'] += max(1, inns1_overs)
            team_stats[team2]['runs_conceded'] += inns1_runs
            team_stats[team2]['overs_bowled'] += max(1, inns1_overs)
        else:
            team_stats[team2]['runs_scored'] += inns1_runs
            team_stats[team2]['overs_faced'] += max(1, inns1_overs)
            team_stats[team1]['runs_conceded'] += inns1_runs
            team_stats[team1]['overs_bowled'] += max(1, inns1_overs)

        # Update venue stats
        if inns1_runs > 50:
            venue_stats[venue]['matches'] += 1
            venue_stats[venue]['total_first_inns_runs'] += inns1_runs
            if winner == inns1_team:
                venue_stats[venue]['bat_first_wins'] += 1
            elif winner:
                venue_stats[venue]['chase_wins'] += 1

        # Form record for ML training
        if winner and (winner in [team1, team2]) and inns1_runs > 40:
            match_dataset.append({
                'match_id': match_id,
                'format': match_type,
                'gender': gender,
                'team1': team1,
                'team2': team2,
                'toss_winner': toss_winner,
                'toss_decision': toss_decision,
                'inns1_team': inns1_team,
                'inns1_runs': inns1_runs,
                'inns1_wickets': inns1_wickets,
                'inns1_overs': inns1_overs,
                'inns2_runs': inns2_runs,
                'inns2_wickets': inns2_wickets,
                'winner': winner,
                'team1_won': 1 if winner == team1 else 0
            })

        # Save curated sample for UI explorer
        if len(processed_matches_sample) < 120:
            processed_matches_sample.append({
                'id': match_id,
                'date': dates[0],
                'teams': [team1, team2],
                'gender': gender,
                'format': match_type,
                'event': event,
                'venue': venue,
                'city': city,
                'toss': f"{toss_winner} elected to {toss_decision}",
                'winner': winner or 'No Result',
                'margin': margin_str,
                'player_of_match': pom,
                'inns1': {'team': inns1_team, 'runs': inns1_runs, 'wickets': inns1_wickets, 'overs': inns1_overs},
                'inns2': {'team': inns2_team, 'runs': inns2_runs, 'wickets': inns2_wickets, 'overs': inns2_overs}
            })

    except Exception as e:
        continue

print(f"[*] Successfully extracted {len(match_dataset):,} valid match rows for ML modeling.")
print(f"[*] Processed {len(team_stats):,} unique teams and {len(venue_stats):,} venues.")

# ---------------------------------------------------------------------------
# 3. Compute Team Power & ELO Ratings
# ---------------------------------------------------------------------------
team_ratings = {}
for team, stats in team_stats.items():
    if stats['matches'] >= 3:
        win_rate = stats['wins'] / stats['matches']
        bat_rr = stats['runs_scored'] / stats['overs_faced']
        bowl_rr = stats['runs_conceded'] / stats['overs_bowled']
        nrr = bat_rr - bowl_rr
        # Rating formula bounded 60 to 98
        power_score = round(70 + (win_rate * 20) + (nrr * 2.5), 1)
        team_ratings[team] = {
            'power': max(65.0, min(97.5, power_score)),
            'matches': stats['matches'],
            'win_rate': round(win_rate * 100, 1),
            'batting_rr': round(bat_rr, 2),
            'bowling_rr': round(bowl_rr, 2),
            'nrr': round(nrr, 2)
        }

# Defaults for missing teams
default_rating = {'power': 75.0, 'matches': 1, 'win_rate': 50.0, 'batting_rr': 7.5, 'bowling_rr': 7.5, 'nrr': 0.0}

# ---------------------------------------------------------------------------
# 4. Train Machine Learning Models
# ---------------------------------------------------------------------------
print("[*] Training Machine Learning Models on Match Features...")

# Prepare ML Training Matrix
X = []
y = []
score_X = []
score_y = []

for m in match_dataset:
    t1_power = team_ratings.get(m['team1'], default_rating)['power']
    t2_power = team_ratings.get(m['team2'], default_rating)['power']
    power_diff = t1_power - t2_power
    
    t1_toss_win = 1.0 if m['toss_winner'] == m['team1'] else 0.0
    toss_bat = 1.0 if m['toss_decision'] == 'bat' else 0.0
    is_t20 = 1.0 if 'T20' in m['format'] else 0.0
    is_odi = 1.0 if 'ODI' in m['format'] or 'ODM' in m['format'] else 0.0
    is_female = 1.0 if m['gender'] == 'female' else 0.0
    
    # Target 1: Win Probability
    # Features: [power_diff, t1_toss_win, toss_bat, is_t20, is_odi, is_female, inns1_run_rate_diff]
    inns1_rr = (m['inns1_runs'] / max(1, m['inns1_overs']))
    
    feature_vec = [
        power_diff,
        t1_toss_win,
        toss_bat,
        is_t20,
        is_odi,
        is_female,
        (inns1_rr - 7.5) if m['inns1_team'] == m['team1'] else -(inns1_rr - 7.5)
    ]
    X.append(feature_vec)
    y.append(m['team1_won'])
    
    # Target 2: Innings 1 Score Projection
    score_features = [
        t1_power if m['inns1_team'] == m['team1'] else t2_power,
        is_t20,
        is_odi,
        is_female,
        toss_bat
    ]
    score_X.append(score_features)
    score_y.append(m['inns1_runs'])

X = np.array(X)
y = np.array(y)
score_X = np.array(score_X)
score_y = np.array(score_y)

# 4A. Logistic Regression Win Predictor
scaler_mean = np.mean(X, axis=0).tolist()
scaler_std = (np.std(X, axis=0) + 1e-6).tolist()
X_scaled = (X - scaler_mean) / scaler_std

win_model = LogisticRegression(C=1.0, max_iter=1000)
win_model.fit(X_scaled, y)
train_acc = accuracy_score(y, win_model.predict(X_scaled))

# 4B. Projected Score Model (Ridge)
score_model = Ridge(alpha=1.0)
score_model.fit(score_X, score_y)
score_pred = score_model.predict(score_X)
score_r2 = r2_score(score_y, score_pred)

print(f"    Win Predictor Training Accuracy: {train_acc * 100:.2f}%")
print(f"    Score Predictor R2 Score: {score_r2:.3f}")

# Feature names & importances
feature_names = [
    "Team Power Rating Differential",
    "Toss Advantage",
    "Decision to Bat First",
    "Format: T20 Match Dynamic",
    "Format: 50-Over ODI Tempo",
    "Women's Competition Variance",
    "1st Innings Run-Rate Momentum"
]
feature_importances = []
for fname, coef in zip(feature_names, win_model.coef_[0]):
    feature_importances.append({
        'feature': fname,
        'weight': round(float(coef), 4),
        'impact': 'Favors Team 1' if coef > 0 else 'Favors Team 2',
        'magnitude': round(abs(float(coef)), 3)
    })

# ---------------------------------------------------------------------------
# 5. Export Optimized JSON Artifacts
# ---------------------------------------------------------------------------
ml_export = {
    'model_version': '4.9.2-AURA-ML',
    'trained_samples': len(X),
    'accuracy': round(float(train_acc), 4),
    'win_model': {
        'coefficients': [round(float(c), 5) for c in win_model.coef_[0]],
        'intercept': round(float(win_model.intercept_[0]), 5),
        'scaler_mean': [round(float(m), 5) for m in scaler_mean],
        'scaler_std': [round(float(s), 5) for s in scaler_std],
        'feature_importances': feature_importances
    },
    'score_model': {
        'coefficients': [round(float(c), 3) for c in score_model.coef_],
        'intercept': round(float(score_model.intercept_), 3),
        'features': ["batting_team_power", "is_t20", "is_odi", "is_female", "chose_bat"]
    },
    'team_ratings': team_ratings,
    'venue_averages': {
        v: {
            'matches': stats['matches'],
            'avg_score': round(stats['total_first_inns_runs'] / max(1, stats['matches']), 1),
            'bat_first_win_pct': round((stats['bat_first_wins'] / max(1, stats['matches'])) * 100, 1)
        }
        for v, stats in sorted(venue_stats.items(), key=lambda x: x[1]['matches'], reverse=True)[:50]
    }
}

with open(os.path.join(OUTPUT_DIR, "ml_models.json"), "w", encoding='utf-8') as f:
    json.dump(ml_export, f, indent=2)
print(f"[+] Wrote {os.path.join(OUTPUT_DIR, 'ml_models.json')}")

with open(os.path.join(OUTPUT_DIR, "players_top.json"), "w", encoding='utf-8') as f:
    json.dump(top_players, f, indent=2)
print(f"[+] Wrote {os.path.join(OUTPUT_DIR, 'players_top.json')}")

with open(os.path.join(OUTPUT_DIR, "recent_matches.json"), "w", encoding='utf-8') as f:
    json.dump(processed_matches_sample, f, indent=2)
print(f"[+] Wrote {os.path.join(OUTPUT_DIR, 'recent_matches.json')}")

analytics_summary = {
    'total_matches_analyzed': len(all_json_files),
    'total_players_indexed': len(top_players),
    'female_matches_count': sum(1 for m in match_dataset if m['gender'] == 'female'),
    'male_matches_count': sum(1 for m in match_dataset if m['gender'] == 'male'),
    't20_avg_runs': round(float(np.mean([m['inns1_runs'] for m in match_dataset if 'T20' in m['format']])), 1) if match_dataset else 165.0,
    'odi_avg_runs': round(float(np.mean([m['inns1_runs'] for m in match_dataset if 'ODI' in m['format']])), 1) if match_dataset else 268.0,
    'highest_rated_teams': sorted([{'team': k, **v} for k, v in team_ratings.items()], key=lambda x: x['power'], reverse=True)[:15]
}

with open(os.path.join(OUTPUT_DIR, "analytics_summary.json"), "w", encoding='utf-8') as f:
    json.dump(analytics_summary, f, indent=2)
print(f"[+] Wrote {os.path.join(OUTPUT_DIR, 'analytics_summary.json')}")

print("[*] Cricket ML Training Pipeline complete!")
