export interface AppState {
  totalMembers: number;
  totalPrayers: number;
  prayersToday: number;
  onlineMembers: number;
  bestDay: string;
  buddhaRoomActive: number;
  jesusRoomActive: number;
}

export const state: AppState = {
  totalMembers: 128541,
  totalPrayers: 25680452,
  prayersToday: 8740,
  onlineMembers: 1248, // Initial, will be overwritten by socket logic but good for seed
  bestDay: "Thứ 2",
  buddhaRoomActive: 832,
  jesusRoomActive: 716,
};

export const getState = () => state;
