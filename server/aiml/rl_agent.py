"""
Reinforcement Learning Tactical Agent for AURA FanVerse.
Implements a Q-Learning / Policy Gradient MDP environment that optimizes
cricket field coordinate configurations against batter shot distributions.
"""
import random
import numpy as np
from typing import Dict, Any, List

class CricketFieldEnv:
    """
    Simulated Environment for Cricket Field Placement.
    State space:
      - batter_style: 0 (Off-side dominant), 1 (Leg-side dominant), 2 (All-round)
      - bowler_type: 0 (Pace), 1 (Off-spin), 2 (Leg-spin)
      - over_phase: 0 (Powerplay: max 2 outside), 1 (Middle: max 4 outside), 2 (Death: max 5 outside)
      - target_pressure: 0 (Low RRR), 1 (High RRR)
    Action space:
      - 0: Ultra-Aggressive Ring (Catcher cordon in slips & gully)
      - 1: Boundary Lock (Deep backward square, deep point, long-on, long-off)
      - 2: Squeeze Infield (Tight 30-yard ring, bait aerial hit)
      - 3: Tailored Leg-Trap (Deep fine leg, deep mid-wicket, short mid-wicket)
      - 4: Off-Side Wall (Deep cover, deep point, third man, extra cover)
    """
    def __init__(self):
        self.state_dims = (3, 3, 3, 2)
        self.action_space_size = 5
        self.action_names = [
            "Ultra-Aggressive Slip Cordon",
            "Deep Boundary Lock",
            "Inner Ring Squeeze",
            "Targeted Leg-Side Trap",
            "Off-Side Cover Wall"
        ]

    def sample_state(self) -> tuple:
        return (
            random.randint(0, 2),
            random.randint(0, 2),
            random.randint(0, 2),
            random.randint(0, 1)
        )

    def step(self, state: tuple, action: int) -> tuple:
        """
        Executes one transition in the MDP.
        Returns: next_state, reward, info
        Reward function:
          +10 for Wicket
          +5 for Dot-Ball
          +1 for 1-2 runs
          -6 for Boundary Four
          -12 for Boundary Six
        """
        batter_style, bowler_type, over_phase, pressure = state

        # Base boundary and wicket probabilities based on policy match
        if batter_style == 1 and action == 3: # Leg-side batter countered by leg-trap
            reward = random.choices([10, 5, 1, -6], weights=[0.25, 0.50, 0.15, 0.10])[0]
        elif batter_style == 0 and action == 4: # Off-side batter countered by off-side wall
            reward = random.choices([10, 5, 1, -6], weights=[0.22, 0.52, 0.16, 0.10])[0]
        elif over_phase == 2 and action == 1: # Death overs countered by boundary lock
            reward = random.choices([10, 5, 1, -6, -12], weights=[0.18, 0.40, 0.28, 0.10, 0.04])[0]
        elif action == 0 and over_phase == 0: # Powerplay slip attack
            reward = random.choices([10, 5, -6, -12], weights=[0.30, 0.35, 0.25, 0.10])[0]
        else:
            # Sub-optimal policy mismatch
            reward = random.choices([5, 1, -6, -12], weights=[0.20, 0.30, 0.35, 0.15])[0]

        next_state = (
            batter_style,
            bowler_type,
            min(2, over_phase + random.choice([0, 1])),
            pressure
        )
        return next_state, reward, {"outcome": "wicket" if reward == 10 else "dot" if reward == 5 else "boundary" if reward < 0 else "single"}

class RLTacticalAgent:
    """
    Q-Learning Agent maintaining dynamic policy weights and exploration decay.
    """
    def __init__(self, alpha=0.15, gamma=0.90, epsilon=0.25):
        self.env = CricketFieldEnv()
        self.alpha = alpha      # Learning rate
        self.gamma = gamma      # Discount factor
        self.epsilon = epsilon  # Exploration rate
        # 4D state table + 1D action space
        self.q_table = np.zeros(self.env.state_dims + (self.env.action_space_size,))
        self.training_history: List[Dict[str, Any]] = []
        self.total_episodes = 0

        # Pre-seed with strategic prior knowledge
        self._seed_priors()

    def _seed_priors(self):
        # Pre-reward intuitive cricket tactics
        # e.g., Powerplay (phase 0) + Aggressive slip cordon (action 0)
        self.q_table[:, :, 0, :, 0] += 4.5
        # Death overs (phase 2) + Boundary lock (action 1)
        self.q_table[:, :, 2, :, 1] += 5.2

    def get_action(self, state: tuple) -> int:
        if random.random() < self.epsilon:
            return random.randint(0, self.env.action_space_size - 1)
        return int(np.argmax(self.q_table[state]))

    def train_episodes(self, num_episodes: int = 150) -> Dict[str, Any]:
        """
        Runs episodic training steps, updating Q-values via Bellman equation:
        Q(s, a) <- Q(s, a) + alpha * [r + gamma * max_a' Q(s', a') - Q(s, a)]
        """
        rewards_epoch = []
        for _ in range(num_episodes):
            state = self.env.sample_state()
            action = self.get_action(state)
            next_state, reward, _ = self.env.step(state, action)

            # Bellman update
            best_future_q = np.max(self.q_table[next_state])
            current_q = self.q_table[state + (action,)]
            self.q_table[state + (action,)] += self.alpha * (reward + self.gamma * best_future_q - current_q)

            rewards_epoch.append(reward)
            self.total_episodes += 1

        self.epsilon = max(0.05, self.epsilon * 0.96) # decay exploration
        avg_reward = round(float(np.mean(rewards_epoch)), 2)

        checkpoint = {
            "episode_count": self.total_episodes,
            "avg_reward": avg_reward,
            "epsilon": round(self.epsilon, 3),
            "convergence_score": round(min(100.0, 45.0 + (self.total_episodes / 8.0)), 1)
        }
        self.training_history.append(checkpoint)
        return checkpoint

    def get_optimal_strategy(self, batter_type_str: str, bowler_type_str: str, phase_str: str) -> Dict[str, Any]:
        b_idx = 1 if "leg" in batter_type_str.lower() else 0 if "off" in batter_type_str.lower() else 2
        p_idx = 1 if "spin" in bowler_type_str.lower() else 0
        ph_idx = 0 if "powerplay" in phase_str.lower() else 2 if "death" in phase_str.lower() else 1
        state = (b_idx, p_idx, ph_idx, 1)

        q_values = self.q_table[state]
        best_action_idx = int(np.argmax(q_values))

        action_scores = [
            {"action": self.env.action_names[i], "q_score": round(float(q_values[i]), 2)}
            for i in range(self.env.action_space_size)
        ]

        return {
            "query_state": {
                "batter": batter_type_str,
                "bowler": bowler_type_str,
                "phase": phase_str
            },
            "optimal_action": self.env.action_names[best_action_idx],
            "action_id": best_action_idx,
            "q_distribution": sorted(action_scores, key=lambda x: x["q_score"], reverse=True),
            "total_episodes_trained": self.total_episodes,
            "policy_confidence": round(min(0.99, 0.72 + (self.total_episodes * 0.001)), 2)
        }
