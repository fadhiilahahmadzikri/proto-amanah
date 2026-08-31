import rawRegistry from './device-frames.registry.json';

export type DeviceFrameDefinition = {
  id: string;
  name: string;
  brand: string;
  frameWidth: number;
  frameHeight: number;
  screenTop: number;
  screenLeft: number;
  screenWidth: number;
  screenHeight: number;
  topPercent: number;
  leftPercent: number;
  widthPercent: number;
  heightPercent: number;
  imagePath: string;
};

export const DEVICE_FRAMES_REGISTRY: DeviceFrameDefinition[] = rawRegistry as DeviceFrameDefinition[];

export const DEFAULT_DEVICE_FRAME_ID = 'apple-iphone-15-pro-2023';

export function getDeviceFrameById(id?: string): DeviceFrameDefinition {
  if (!id) {
    return DEVICE_FRAMES_REGISTRY.find(d => d.id === DEFAULT_DEVICE_FRAME_ID) || DEVICE_FRAMES_REGISTRY[0]!;
  }
  return DEVICE_FRAMES_REGISTRY.find(d => d.id === id)
    || DEVICE_FRAMES_REGISTRY.find(d => d.id === DEFAULT_DEVICE_FRAME_ID)
    || DEVICE_FRAMES_REGISTRY[0]!;
}

export function getDeviceBrands(): string[] {
  const brands = new Set<string>();
  DEVICE_FRAMES_REGISTRY.forEach(d => brands.add(d.brand));
  return Array.from(brands);
}
