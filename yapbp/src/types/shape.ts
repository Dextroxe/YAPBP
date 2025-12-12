// Types for portfolio shapes and content
export type ShapeType = 'square' | 'rectangle' | 'circle';
export type ShapeSize = 'small' | 'medium' | 'large';

export interface ShapeContent {
  title?: string;
  subText?: string;
  imageUrl?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface ShapeData {
  id: string;
  type: ShapeType;
  size?: ShapeSize; // Optional size - defaults to medium if not specified
  width?: number; // Custom width in pixels (overrides size preset)
  height?: number; // Custom height in pixels (overrides size preset)
  content: ShapeContent;
  position: Position;
  order?: number; // For sorting in grid layout
}
