import type GeoJSON from "geojson";
import { getSupabase } from "@/lib/supabase";
import { toFeature, toFeatureCollection } from "@/lib/geojson";
import { DEMO_STATIONS } from "@/infrastructure/mock/fixtures/stations";

export class ServerStationRepository {
  async findAll() {
    try {
      const { data, error } = await getSupabase()
        .from("station_nodes_geojson")
        .select("*");

      if (error) throw new Error(error.message);
      const rows = (data || []).map((row: Record<string, unknown>) => ({
        ...row,
        geometry: row.geometry as unknown as GeoJSON.Geometry,
      }));
      return toFeatureCollection(rows);
    } catch {
      return DEMO_STATIONS;
    }
  }

  async search(query: string) {
    try {
      const { data, error } = await getSupabase()
        .from("station_nodes_geojson")
        .select("*")
        .ilike("station_name", `%${query}%`);

      if (error) throw new Error(error.message);
      const rows = (data || []).map((row: Record<string, unknown>) => ({
        ...row,
        geometry: row.geometry as unknown as GeoJSON.Geometry,
      }));
      return toFeatureCollection(rows);
    } catch {
      const q = query.toLowerCase();
      const filtered = DEMO_STATIONS.features.filter((f) =>
        f.properties.station_name.toLowerCase().includes(q),
      );
      return {
        type: "FeatureCollection" as const,
        features: filtered,
      };
    }
  }

  async findById(stationId: string) {
    try {
      const { data, error } = await getSupabase()
        .from("station_nodes_geojson")
        .select("*")
        .eq("station_id", stationId)
        .single();

      if (error) throw new Error(error.message);
      if (!data) return null;
      const row = {
        ...data,
        geometry: data.geometry as unknown as GeoJSON.Geometry,
      };
      return toFeature(row);
    } catch {
      const found = DEMO_STATIONS.features.find(
        (f) => f.properties.station_id === stationId,
      );
      return found || null;
    }
  }
}

export const serverStationRepository = new ServerStationRepository();
