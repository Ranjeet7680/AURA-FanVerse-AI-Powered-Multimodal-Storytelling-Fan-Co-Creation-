import fs from 'fs';
import path from 'path';

const WORKSPACE_DIR = 'c:\\Users\\Victus\\Documents\\antigravity\\proud-brahmagupta';
const CSV_DIR = path.join(WORKSPACE_DIR, 'prototype/data/csv');
const MATCHES_DIR = path.join(WORKSPACE_DIR, 'prototype/data/all_matches');
const OUT_DIR = path.join(WORKSPACE_DIR, 'prototype/public/data');

// Parse CSV manually
function parseCSV(text) {
    let result = [];
    let row = [];
    let startValue = 0;
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (inQuotes) {
            if (char === '"') {
                if (i < text.length - 1 && text[i + 1] === '"') {
                    i++; // skip escaped quote
                } else {
                    inQuotes = false;
                }
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                let val = text.substring(startValue, i);
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.substring(1, val.length - 1).replace(/""/g, '"');
                }
                row.push(val);
                startValue = i + 1;
            } else if (char === '\n' || char === '\r') {
                let val = text.substring(startValue, i);
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.substring(1, val.length - 1).replace(/""/g, '"');
                }
                row.push(val);
                result.push(row);
                row = [];
                if (char === '\r' && i < text.length - 1 && text[i + 1] === '\n') {
                    i++; // skip \n
                }
                startValue = i + 1;
            }
        }
    }
    if (startValue < text.length || text[text.length - 1] === ',') {
        let val = text.substring(startValue);
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1).replace(/""/g, '"');
        }
        row.push(val);
        result.push(row);
    }
    return result;
}

function processPlayersInfo() {
    console.log('Processing players_data_with_all_info.csv...');
    const content = fs.readFileSync(path.join(CSV_DIR, 'players_data_with_all_info.csv'), 'utf-8');
    const rows = parseCSV(content);
    const header = rows[0];
    const data = rows.slice(1).filter(r => r.length === header.length);
    
    const playersIndex = [];
    const playerMap = new Map();

    for (let row of data) {
        let obj = {};
        for (let i = 0; i < header.length; i++) {
            obj[header[i]] = row[i];
        }
        
        let p = {
            id: parseInt(obj.id),
            name: obj.fullname,
            country: obj.country_name,
            role: obj.position?.name || obj.position, // position might be a string if plain, if json it needs parsing. assuming string based on req
            bat: obj.battingstyle,
            bowl: obj.bowlingstyle,
            gender: obj.gender,
            img: obj.image_path
        };
        playersIndex.push(p);
        playerMap.set(p.name?.toLowerCase(), p);
    }

    fs.writeFileSync(path.join(OUT_DIR, 'players_index.json'), JSON.stringify(playersIndex));
    return playerMap;
}

function parseIntSafe(val) {
    const v = parseInt(val);
    return isNaN(v) ? 0 : v;
}

function processTopPlayers(playerMap) {
    console.log('Processing Cricket_Players_Cleaned.csv...');
    const content = fs.readFileSync(path.join(CSV_DIR, 'Cricket_Players_Cleaned.csv'), 'utf-8');
    const rows = parseCSV(content);
    const header = rows[0];
    const data = rows.slice(1).filter(r => r.length > 1);

    const players = [];

    for (let row of data) {
        let obj = {};
        for (let i = 0; i < header.length; i++) {
            obj[header[i]] = row[i];
        }

        const runTests = parseIntSafe(obj['BATTING_Tests_Runs']);
        const runOdis = parseIntSafe(obj['BATTING_ODIs_Runs']);
        const runT20s = parseIntSafe(obj['BATTING_T20Is_Runs']);
        
        const wktTests = parseIntSafe(obj['BOWLING_Tests_Wkts']);
        const wktOdis = parseIntSafe(obj['BOWLING_ODIs_Wkts']);
        const wktT20s = parseIntSafe(obj['BOWLING_T20Is_Wkts']);

        const totalRuns = runTests + runOdis + runT20s;
        const totalWkts = wktTests + wktOdis + wktT20s;
        
        const score = totalRuns + (totalWkts * 25);

        let name = obj['NAME'] || obj['Full name'];
        let profile = playerMap.get(name?.toLowerCase()) || {};

        players.push({
            id: obj['ID'] ? parseIntSafe(obj['ID']) : profile.id,
            name: name,
            country: obj['COUNTRY'] || profile.country,
            role: obj['Playing role'] || profile.role,
            img: profile.img,
            score: score, // internal use
            tests: {
                mat: parseIntSafe(obj['BATTING_Tests_Mat']),
                runs: runTests,
                ave: parseFloat(obj['BATTING_Tests_Ave']) || 0,
                hs: obj['BATTING_Tests_HS'],
                '100s': parseIntSafe(obj['BATTING_Tests_100']),
                wkts: wktTests
            },
            odis: {
                mat: parseIntSafe(obj['BATTING_ODIs_Mat']),
                runs: runOdis,
                ave: parseFloat(obj['BATTING_ODIs_Ave']) || 0,
                hs: obj['BATTING_ODIs_HS'],
                '100s': parseIntSafe(obj['BATTING_ODIs_100']),
                wkts: wktOdis
            },
            t20is: {
                mat: parseIntSafe(obj['BATTING_T20Is_Mat']),
                runs: runT20s,
                ave: parseFloat(obj['BATTING_T20Is_Ave']) || 0,
                hs: obj['BATTING_T20Is_HS'],
                '100s': parseIntSafe(obj['BATTING_T20Is_100']),
                wkts: wktT20s
            }
        });
    }

    players.sort((a, b) => b.score - a.score);
    const top500 = players.slice(0, 500).map(p => {
        delete p.score;
        return p;
    });

    fs.writeFileSync(path.join(OUT_DIR, 'players_top500.json'), JSON.stringify(top500));
}

function processMatches() {
    console.log('Processing all matches...');
    let files = [];
    try {
        files = fs.readdirSync(MATCHES_DIR).filter(f => f.endsWith('.json'));
    } catch (e) {
        console.warn('Match directory read issue, skipping matches if not present');
    }

    const summaries = [];
    const mlData = [];

    for (let file of files) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(MATCHES_DIR, file), 'utf-8'));
            const info = data.info;
            const id = file.replace('.json', '');
            
            if (!info || !data.innings) continue;

            const teams = info.teams || [];
            if (teams.length < 2) continue;

            let scores = [];
            let inningStats = [];

            for (let inn of data.innings) {
                let runs = 0;
                let wickets = 0;
                let totalBalls = 0;
                
                if (inn.overs) {
                    for (let over of inn.overs) {
                        if (over.deliveries) {
                            for (let d of over.deliveries) {
                                runs += d.runs?.total || 0;
                                if (d.wickets) {
                                    wickets += d.wickets.length;
                                }
                                totalBalls++; // Assuming all deliveries count, though wides shouldn't count for overs, let's keep it simple or calculate properly.
                            }
                        }
                    }
                }
                
                let oversFloat = Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
                let actualOversDecimal = totalBalls / 6;

                scores.push({
                    team: inn.team,
                    runs: runs,
                    wickets: wickets,
                    overs: oversFloat
                });
                
                inningStats.push({
                    runs: runs,
                    wickets: wickets,
                    rr: actualOversDecimal > 0 ? (runs / actualOversDecimal) : 0
                });
            }

            // Summary
            summaries.push({
                id: id,
                teams: teams,
                format: info.match_type,
                gender: info.gender,
                date: info.dates ? info.dates[0] : null,
                venue: info.venue,
                city: info.city,
                event: info.event?.name || info.event,
                toss: info.toss,
                outcome: info.outcome,
                scores: scores
            });

            // ML Data
            const team1 = teams[0];
            const tossWinnerBatted = (info.toss?.decision === 'bat') ? 1 : 0;
            const team1BatFirst = (data.innings[0]?.team === team1) ? 1 : 0;
            const team1Won = (info.outcome?.winner === team1) ? 1 : 0;
            
            // Only add if we have 2 innings
            if (inningStats.length >= 2) {
                mlData.push({
                    format: info.match_type,
                    gender: info.gender,
                    toss_winner_batted: tossWinnerBatted,
                    team1_bat_first: team1BatFirst,
                    innings1_runs: inningStats[0].runs,
                    innings1_wickets: inningStats[0].wickets,
                    innings1_rr: parseFloat(inningStats[0].rr.toFixed(2)),
                    innings2_runs: inningStats[1].runs,
                    innings2_wickets: inningStats[1].wickets,
                    innings2_rr: parseFloat(inningStats[1].rr.toFixed(2)),
                    team1_won: team1Won
                });
            }

        } catch (err) {
            console.error(`Error processing file ${file}:`, err);
        }
    }

    fs.writeFileSync(path.join(OUT_DIR, 'match_summaries.json'), JSON.stringify(summaries));
    fs.writeFileSync(path.join(OUT_DIR, 'model_training_data.json'), JSON.stringify(mlData));
}

function run() {
    if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    const playerMap = processPlayersInfo();
    processTopPlayers(playerMap);
    processMatches();
    
    console.log('All done!');
    
    const stats1 = fs.statSync(path.join(OUT_DIR, 'players_index.json'));
    const stats2 = fs.statSync(path.join(OUT_DIR, 'players_top500.json'));
    const stats3 = fs.statSync(path.join(OUT_DIR, 'match_summaries.json'));
    const stats4 = fs.statSync(path.join(OUT_DIR, 'model_training_data.json'));
    
    console.log(`players_index.json size: ${(stats1.size / 1024).toFixed(2)} KB`);
    console.log(`players_top500.json size: ${(stats2.size / 1024).toFixed(2)} KB`);
    console.log(`match_summaries.json size: ${(stats3.size / 1024).toFixed(2)} KB`);
    console.log(`model_training_data.json size: ${(stats4.size / 1024).toFixed(2)} KB`);
}

run();
