export type recommendation = {
    id: number;
    profile_id: number;
    conditioners: Array<string>;
    shampoos: Array<string>;
    leave_in_conditioners: Array<string>;
};
  
export type hair_profile = {
    id: number;
    name: string,
    curl_type: string;
    porosity: string;
    volume: string;
    desired_outcome: string;
    recommendation: recommendation | null;
};
  
export interface User {
    user_id: number;
    username: string;
    email: string;
    role: number;
    hair_profiles: Array<hair_profile>; // Changed to array
}