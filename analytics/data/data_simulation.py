import numpy as np
import pandas as pd
import uuid
import os

# 1. Establish Replication Anchors & Design Scale
np.random.seed(42)
n_per_variant = 7210
total_users = n_per_variant * 2
days_in_experiment = 28

# 2. Initialize Cohort Assignment Dataframes (Probabilistic Variant Assignment)
user_ids = [str(uuid.uuid4())[:8] for _ in range(total_users)]

# Ingest realistic variance via independent Bernoulli assignment trials
variants = np.random.choice(["control", "treatment"], size=total_users, p=[0.5, 0.5])

df_users = pd.DataFrame({"user_id": user_ids, "variant": variants})

actual_control_n = sum(df_users["variant"] == "control")
actual_treatment_n = sum(df_users["variant"] == "treatment")

print("--- Real-World Assignment Variance Injected ---")
print(f"Actual Control Sample: {actual_control_n:,} users")
print(f"Actual Treatment Sample: {actual_treatment_n:,} users")

# 3. Model Local Behavioral Parameters (Compliance & Baseline)
df_users["complier"] = 0
treatment_mask = df_users["variant"] == "treatment"
actual_treatment_indices = df_users[treatment_mask].index

# Dynamically pull 40% based on the size of the actual treatment cohort generated
compliant_indices = np.random.choice(
    actual_treatment_indices,
    size=int(len(actual_treatment_indices) * 0.40),
    replace=False,
)
df_users.loc[compliant_indices, "complier"] = 1

# 4. Generate Daily Logged Stream Heartbeats (Calibrated to 75% Autoplay Mix / 95% Retention)
all_daily_records = []

# Pre-calculate user-level retention flags to mirror your exact 95.0% brief metric
df_users["is_retained_w4"] = 1
for idx, row in df_users.iterrows():
    retention_probability = 0.952 if row["variant"] == "control" else 0.948
    if np.random.rand() > retention_probability:
        df_users.loc[idx, "is_retained_w4"] = 0

for day in range(1, days_in_experiment + 1):
    for idx, row in df_users.iterrows():

        # Eliminate churned user traffic from Week 4 logs
        if day >= 21 and df_users.loc[idx, "is_retained_w4"] == 0:
            continue

        # CALIBRATED ENSEMBLE MIX:
        # Generates ~30 minutes/day search (210 mins/wk) and ~90 minutes/day autoplay (630 mins/wk)
        base_search_minutes = np.random.normal(loc=30.0, scale=15.0)
        base_autoplay_minutes = np.random.normal(loc=90.0, scale=45.0)

        # Clamp to 0 to prevent negative values from the distribution spreads
        base_search_minutes = max(0, float(base_search_minutes))
        base_autoplay_minutes = max(0, float(base_autoplay_minutes))

        # Inject the treatment effect (+2% target relative OEC lift on the total)
        if row["variant"] == "treatment" and row["complier"] == 1:
            smart_queue_minutes = max(0, float(np.random.normal(loc=46.0, scale=15.0)))
            # Smart queue converts passive autoplay into active choice interaction
            base_autoplay_minutes = max(
                0,
                base_autoplay_minutes
                - max(0, float(np.random.normal(loc=12.0, scale=3.0))),
            )
            base_search_minutes += max(0, float(np.random.normal(loc=4.0, scale=2.0)))
        else:
            smart_queue_minutes = 0

        total_daily_mins = (
            base_search_minutes + base_autoplay_minutes + smart_queue_minutes
        )

        # EXACT SESSION-LEVEL COEFFICIENTS: Grounded to return your clean 0.20% session profile
        error_rate = 0.0020 if row["variant"] == "control" else 0.0025
        crashes_encountered = np.random.binomial(n=1, p=error_rate)

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
                "w4_active_day": 1 if day >= 21 else 0,
            }
        )

df_experiment_log = pd.DataFrame(all_daily_records)

# 5. Output Sanity Verification Checks
print("\n--- Simulated Dataset Generation Complete ---")
print(f"Total Rows Generated: {len(df_experiment_log):,}")
print("Approximate Weekly Mean Check per Enrolled User:")
print(df_experiment_log.groupby("variant")["total_minutes"].sum() / n_per_variant / 4.0)

# 6. Save Data to Repo Pipeline Directory (Robust Subfolder Path Execution)
current_script_dir = os.path.dirname(os.path.abspath(__file__))
output_file_path = os.path.join(current_script_dir, "simulated_experiment_log.csv")

df_experiment_log.to_csv(output_file_path, index=False)
print(f"\n✅ File successfully written to disk at:\n{output_file_path}")
