import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig.extra || {};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const syncTasks = async (tasks) => {
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    await supabase.from('tasks').upsert(tasks);
  } catch (e) {
    console.error('Supabase sync error', e);
  }
};
