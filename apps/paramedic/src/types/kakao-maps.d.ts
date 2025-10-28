declare global {
    interface Window {
      kakao: KakaoMaps;
    }
  }
  
  interface KakaoMaps {
    maps: {
      load: (callback: () => void) => void;
      LatLng: new (lat: number, lng: number) => KakaoLatLng;
      Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
      Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
      MarkerImage: new (src: string, size: KakaoSize) => KakaoMarkerImage;
      Size: new (width: number, height: number) => KakaoSize;
      Polyline: new (options: KakaoPolylineOptions) => KakaoPolyline;
      LatLngBounds: new () => KakaoLatLngBounds;
      CustomOverlay: new (options: KakaoCustomOverlayOptions) => KakaoCustomOverlay;
    };
  }
  
  interface KakaoLatLng {
    getLat: () => number;
    getLng: () => number;
  }
  
  interface KakaoMapOptions {
    center: KakaoLatLng;
    level: number;
  }
  
  interface KakaoMap {
    setCenter: (latlng: KakaoLatLng) => void;
    getCenter: () => KakaoLatLng;
    setLevel: (level: number) => void;
    getLevel: () => number;
    setBounds: (bounds: KakaoLatLngBounds) => void;
  }
  
  interface KakaoMarkerOptions {
    position: KakaoLatLng;
    image?: KakaoMarkerImage;
    map?: KakaoMap;
  }
  
  interface KakaoMarker {
    setMap: (map: KakaoMap | null) => void;
    getPosition: () => KakaoLatLng;
  }
  
  type KakaoMarkerImage = Record<string, unknown>;
  
  type KakaoSize = Record<string, unknown>;
  
  interface KakaoPolylineOptions {
    path: KakaoLatLng[];
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle: string;
  }
  
  interface KakaoPolyline {
    setMap: (map: KakaoMap | null) => void;
  }
  
  interface KakaoLatLngBounds {
    extend: (latlng: KakaoLatLng) => void;
    contain: (latlng: KakaoLatLng) => boolean;
  }
  
  interface KakaoCustomOverlayOptions {
    position: KakaoLatLng;
    content: string | HTMLElement;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
  }
  
  interface KakaoCustomOverlay {
    setMap: (map: KakaoMap | null) => void;
    getPosition: () => KakaoLatLng;
    setPosition: (position: KakaoLatLng) => void;
    setContent: (content: string | HTMLElement) => void;
    setZIndex: (zIndex: number) => void;
  }
  
  export {};