import numpy as np
import pandas as pd
import uuid

# 1. Establish Replication Anchors & Design Scale
np.random.seed(42)
n_per_variant = 7210
total_users = n_per_variant * 2
days_in_experiment = 28

# 2. Initialize Cohort Assignment Dataframes
user_ids = [str(uuid.uuid4())[:8] for _ in range(total_users)]
variants = ["control"] * n_per_variant + ["treatment"] * n_per_variant

df_users = pd.DataFrame({"user_id": user_ids, "variant": variants})

# 3. Model Local Behavioral Parameters (Compliance & Baseline)
# Assume 40% of Treatment users comply/interact with the new dropdown banner
df_users["complier"] = 0
treatment_mask = df_users["variant"] == "treatment"
compliant_indices = np.random.choice(
    df_users[treatment_mask].index, size=int(n_per_variant * 0.40), replace=False
)
df_users.loc[compliant_indices, "complier"] = 1

# 4. Generate Daily Logged Stream Heartbeats Across Timeline
all_daily_records = []

for day in range(1, days_in_experiment + 1):
    for idx, row in df_users.iterrows():
        # Set historical default behaviors
        base_search_minutes = np.random.negative_binomial(
            n=10, p=0.03
        )  # Raw volume proxy
        base_autoplay_minutes = np.random.negative_binomial(
            n=5, p=0.03
        )  # Cannibalization target

        # Inject the treatment effect using CACE parameters
        if row["variant"] == "treatment" and row["complier"] == 1:
            # Compliers discover and love the feature:
            smart_queue_minutes = np.random.poisson(lam=12)  # Use feature heavily
            # Cannibalization check: Drop autoplay slightly due to active queueing
            base_autoplay_minutes = max(
                0, base_autoplay_minutes - np.random.poisson(lam=3)
            )
            # Primary OEC Gain: Total listening increases due to choice engagement
            base_search_minutes += np.random.poisson(lam=4)
        else:
            smart_queue_minutes = 0

        # Calculate Total Composite Minutes per user-day
        total_daily_mins = (
            base_search_minutes + base_autoplay_minutes + smart_queue_minutes
        )

        # Simulating random daily session errors (Guardrail check)
        # Control & Treatment base error rate is 0.2%, but check for feature bugs
        error_rate = 0.002 if row["variant"] == "control" else 0.0025
        crashes_encountered = np.random.binomial(n=1, p=error_rate)

        # Structure event-level metadata row
        all_daily_records.append(
            {
                "user_id": row["user_id"],
                "variant": row["variant"],
                "is_complier": row["complier"],
                "experiment_day": day,
                "search_minutes": base_search_minutes,
                "autoplay_minutes": base_autoplay_minutes,
                "smart_queue_minutes": smart_queue_minutes,
                "total_minutes": total_daily_mins,
                "crashes": crashes_encountered,
                # Model retention active flag: binary presence signal for Week 4
                "w4_active_day": 1 if (day >= 21 and np.random.rand() < 0.78) else 0,
            }
        )

df_experiment_log = pd.DataFrame(all_daily_records)

# 5. Output Sanity Verification Checks
print("--- Simulated Dataset Generation Complete ---")
print(f"Total Rows Generated: {len(df_experiment_log):,}")
print(
    df_experiment_log.groupby("variant")["total_minutes"].mean() / 7
)  # Daily to weekly mean check

# 6. Save Data to Repo Pipeline Directory
df_experiment_log.to_csv("simulated_experiment_log.csv", index=False)
print("Saved cleanly to simulated_experiment_log.csv")
