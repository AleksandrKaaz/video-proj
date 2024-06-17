import { Coordinate } from "./coordinate";

export interface Timestamp {
    /**
     * @description int тайминг события
     */
    timestamp: number;

    /**
     * @description int продолжительность события
     */
    duration: number;

    /**
     * @description Coordinate описание координат события
     */
    zone: Coordinate;
}