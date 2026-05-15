import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 8080,
    experiment: {
        COLOR_EXPERIMENT: {
            targetTotalWeight: parseInt(process.env.COLOR_EXPERIMENT__TARGET_TOTAL_WEIGHT || '100', 10),
            weights: {
                Group_A: parseInt(process.env.COLOR_EXPERIMENT__WEIGHT_Group__Group_A || '34', 10),
                Group_B: parseInt(process.env.COLOR_EXPERIMENT__WEIGHT_Group__Group_B || '33', 10),
                Group_C: parseInt(process.env.COLOR_EXPERIMENT__WEIGHT_Group__Group_C || '33', 10)
            }
        }
    }
};
