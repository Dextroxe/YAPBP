// Types for portfolio sections that can contain multiple shapes
import { ShapeData } from "./shape";

export type GapSize = 'tight' | 'normal' | 'relaxed' | 'loose';

export interface SectionData {
  id: string;
  title: string;
  shapes: ShapeData[];
  order: number;
  gap?: GapSize; // Optional gap size - defaults to normal if not specified
}

export interface PortfolioData {
  sections: SectionData[];
  unsectionedShapes: ShapeData[]; // Shapes not in any section
}
