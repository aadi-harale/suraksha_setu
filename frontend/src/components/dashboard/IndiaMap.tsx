'use client';
import { useState, useMemo } from 'react';
import { Map as MapIcon, Maximize2 } from 'lucide-react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, ColumnLayer, TextLayer, GeoJsonLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const CITIES = [
  { id: 'delhi', name: 'Delhi', coordinates: [77.1025, 28.7041], cases: 142, topScam: 'Courier/Customs Scam', risk: 'High', radiusKm: 25 },
  { id: 'jaipur', name: 'Jaipur', coordinates: [75.7873, 26.9124], cases: 45, topScam: 'Police Cybercrime', risk: 'High', radiusKm: 18 },
  { id: 'mumbai', name: 'Mumbai', coordinates: [72.8777, 19.0760], cases: 188, topScam: 'CBI Digital Arrest', risk: 'Critical', pulse: true, radiusKm: 22 },
  { id: 'pune', name: 'Pune', coordinates: [73.8567, 18.5204], cases: 73, topScam: 'CBI Digital Arrest', risk: 'High', radiusKm: 15 },
  { id: 'bengaluru', name: 'Bengaluru', coordinates: [77.5946, 12.9716], cases: 156, topScam: 'TRAI SIM Block', risk: 'Critical', radiusKm: 28 },
  { id: 'chennai', name: 'Chennai', coordinates: [80.2707, 13.0827], cases: 94, topScam: 'Customs Parcel', risk: 'High', radiusKm: 20 },
  { id: 'hyderabad', name: 'Hyderabad', coordinates: [78.4867, 17.3850], cases: 112, topScam: 'Investment Fraud', risk: 'High', radiusKm: 24 },
  { id: 'kolkata', name: 'Kolkata', coordinates: [88.3639, 22.5726], cases: 58, topScam: 'Bank KYC Fraud', risk: 'Suspicious', radiusKm: 20 },
  { id: 'ahmedabad', name: 'Ahmedabad', coordinates: [72.5714, 23.0225], cases: 81, topScam: 'Digital Arrest', risk: 'High', radiusKm: 18 },
  { id: 'lucknow', name: 'Lucknow', coordinates: [80.9462, 26.8467], cases: 39, topScam: 'WhatsApp Task Fraud', risk: 'Suspicious', radiusKm: 15 },
  { id: 'chandigarh', name: 'Chandigarh', coordinates: [76.7794, 30.7333], cases: 27, topScam: 'Immigration Scam', risk: 'Suspicious', radiusKm: 10 },
  { id: 'kochi', name: 'Kochi', coordinates: [76.2673, 9.9312], cases: 41, topScam: 'Cryptocurrency Scam', risk: 'Suspicious', radiusKm: 12 },
  { id: 'indore', name: 'Indore', coordinates: [75.8577, 22.7196], cases: 33, topScam: 'Fake Loan App', risk: 'Suspicious', radiusKm: 14 },
  { id: 'bhopal', name: 'Bhopal', coordinates: [77.4126, 23.2599], cases: 21, topScam: 'OTP Fraud', risk: 'Suspicious', radiusKm: 14 },
  { id: 'patna', name: 'Patna', coordinates: [85.1376, 25.5941], cases: 15, topScam: 'Sextortion', risk: 'Low', radiusKm: 12 },
  { id: 'guwahati', name: 'Guwahati', coordinates: [91.7362, 26.1445], cases: 12, topScam: 'Lottery Scam', risk: 'Low', radiusKm: 10 },
  { id: 'nagpur', name: 'Nagpur', coordinates: [79.0882, 21.1458], cases: 48, topScam: 'Job Fraud', risk: 'Suspicious', radiusKm: 15 },
  { id: 'surat', name: 'Surat', coordinates: [72.8311, 21.1702], cases: 62, topScam: 'Trading Scam', risk: 'High', radiusKm: 16 },
  { id: 'kanpur', name: 'Kanpur', coordinates: [80.3319, 26.4499], cases: 31, topScam: 'Bank Fraud', risk: 'Suspicious', radiusKm: 15 },
];

function generateCityOutline(center: number[], radiusKm: number, seed: number) {
  const points = 32; // Higher point count for realistic jagged borders
  const coords = [];
  
  // Simple pseudo-random generator so shapes are distinct per city but don't jitter on re-render
  let currentSeed = Math.floor(Math.abs(center[0] * center[1] * seed));
  const random = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    
    // Add distinct per-city noise + low frequency wave
    const highFreqNoise = (random() * 0.4) - 0.2; // -0.2 to +0.2
    const lowFreqNoise = Math.sin(angle * 3 + random() * 2) * 0.15;
    const r = radiusKm * (0.85 + highFreqNoise + lowFreqNoise); 
    
    const latOffset = (r / 111) * Math.sin(angle);
    const lngOffset = (r / (111 * Math.cos(center[1] * Math.PI / 180))) * Math.cos(angle);
    coords.push([center[0] + lngOffset, center[1] + latOffset]);
  }
  coords.push(coords[0]); // close the loop
  return coords;
}

const INITIAL_VIEW_STATE = {
  longitude: 78.9629,
  latitude: 22.5937,
  zoom: 4.2,
  pitch: 45,
  bearing: -10
};

export default function IndiaMap() {
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const getRiskColor = (risk: string, opacity: number = 200): [number, number, number, number] => {
    switch (risk) {
      case 'Critical': return [239, 68, 68, opacity]; 
      case 'High': return [249, 115, 22, opacity]; 
      case 'Suspicious': return [234, 179, 8, opacity]; 
      default: return [56, 189, 248, opacity]; 
    }
  };

  const geoJsonData = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: CITIES.map(city => ({
        type: 'Feature',
        properties: { ...city },
        geometry: {
          type: 'Polygon',
          coordinates: [generateCityOutline(city.coordinates, city.radiusKm, city.cases)]
        }
      }))
    };
  }, []);

  // Calculate dynamic transition factors based on zoom
  // When zoomed out (zoom < 5), columns are prominent, outlines are invisible.
  // When zoomed in (zoom > 7.5), columns disappear, outlines are fully visible.
  const zoom = viewState.zoom;
  const columnOpacity = Math.max(0, Math.min(1, (8 - zoom) / 3));
  const outlineOpacity = Math.max(0, Math.min(1, (zoom - 5) / 2.5));

  const layers = [
    // City outlines (visible when zoomed in)
    new GeoJsonLayer({
      id: 'city-outlines',
      data: geoJsonData as any,
      pickable: true,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      getFillColor: (d: any) => getRiskColor(d.properties.risk, Math.floor(40 * outlineOpacity)),
      getLineColor: (d: any) => getRiskColor(d.properties.risk, Math.floor(255 * outlineOpacity)),
      onHover: info => setHoverInfo(info?.object?.properties ? { ...info, object: info.object.properties } : null),
      updateTriggers: {
        getFillColor: [outlineOpacity],
        getLineColor: [outlineOpacity]
      }
    }),
    
    // Base glow layer (always visible for ambient glow)
    new ScatterplotLayer({
      id: 'cities-glow',
      data: CITIES,
      pickable: false,
      opacity: columnOpacity * 0.3,
      stroked: false,
      filled: true,
      radiusScale: 15000,
      radiusMinPixels: 20,
      radiusMaxPixels: 80,
      getPosition: d => d.coordinates,
      getFillColor: d => getRiskColor(d.risk, 80),
      updateTriggers: {
        opacity: [columnOpacity]
      }
    }),
    
    // 3D Columns for data density (visible when zoomed out)
    new ColumnLayer({
      id: 'cities-3d-columns',
      data: CITIES,
      diskResolution: 12,
      radius: 18000,
      extruded: true,
      pickable: outlineOpacity < 0.5, // Only pickable when outlines aren't fully covering them
      elevationScale: 1500,
      getPosition: d => d.coordinates,
      getFillColor: d => getRiskColor(d.risk, Math.floor(240 * columnOpacity)),
      getLineColor: [0, 0, 0, Math.floor(150 * columnOpacity)],
      getElevation: d => d.cases,
      onHover: info => {
        if (outlineOpacity < 0.5) setHoverInfo(info);
      },
      transitions: {
        getElevation: 1000,
      },
      updateTriggers: {
        getFillColor: [columnOpacity],
        getLineColor: [columnOpacity]
      }
    }),
    
    // Text Labels
    new TextLayer({
      id: 'cities-text',
      data: CITIES,
      getPosition: d => d.coordinates,
      getText: d => d.name,
      getSize: 12,
      getColor: [255, 255, 255, 200],
      getPixelOffset: [0, 20],
      fontFamily: 'Inter, sans-serif',
      fontWeight: 'bold',
      background: true,
      getBackgroundColor: [15, 23, 42, 220],
      backgroundPadding: [4, 2]
    })
  ];

  const [mapMode, setMapMode] = useState<'3d' | 'lite'>('3d');

  return (
    <div className="glass-panel rounded-xl border border-slate-800 flex flex-col shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden h-full w-full">
       <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700/50 flex items-center gap-2 shadow-xl pointer-events-auto">
            <MapIcon className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-slate-200 text-sm">Live Geospatial Threat Map</h3>
          </div>
          
          <div className="pointer-events-auto flex gap-2">
            <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/50 flex shadow-xl">
              <button 
                onClick={() => setMapMode('3d')}
                className={`px-3 py-1 text-xs font-bold rounded ${mapMode === '3d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                3D War Room
              </button>
              <button 
                onClick={() => setMapMode('lite')}
                className={`px-3 py-1 text-xs font-bold rounded ${mapMode === 'lite' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Lite Map
              </button>
            </div>
          </div>
       </div>
       
       <div className="flex-1 relative w-full h-full bg-slate-950 flex items-center justify-center">
          {mapMode === '3d' ? (
            <>
              <DeckGL
                viewState={viewState}
                onViewStateChange={({viewState}) => setViewState(viewState as any)}
                controller={true}
                layers={layers}
                getCursor={({isDragging}) => isDragging ? 'grabbing' : 'crosshair'}
              >
                <Map 
                  mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
                  attributionControl={false}
                />
              </DeckGL>

              {hoverInfo && hoverInfo.object && (
                <div 
                  className="absolute z-50 pointer-events-none bg-slate-900/95 border border-slate-700 p-3.5 rounded-lg shadow-2xl backdrop-blur-sm min-w-[180px]"
                  style={{
                    left: hoverInfo.x,
                    top: hoverInfo.y,
                    transform: 'translate(-50%, -100%)',
                    marginTop: '-25px'
                  }}
                >
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                    <div className="font-bold text-slate-200 text-sm tracking-wide">{hoverInfo.object.name}</div>
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${hoverInfo.object.risk === 'Critical' ? 'bg-red-500/20 text-red-400' : hoverInfo.object.risk === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {hoverInfo.object.risk}
                    </span>
                  </div>
                  <div className="text-xs flex justify-between gap-4 py-1">
                    <span className="text-slate-400">Active Cases:</span>
                    <span className="font-bold text-white text-sm">{hoverInfo.object.cases}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 bg-slate-950/50 p-2 rounded border border-slate-800">
                    <div className="mb-0.5 uppercase tracking-wider">Top Vector</div>
                    <div className="text-emerald-400/90 font-medium">{hoverInfo.object.topScam}</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full relative bg-slate-900 flex items-center justify-center p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {CITIES.filter(c => ['mumbai', 'pune', 'delhi', 'jaipur', 'bengaluru', 'chennai'].includes(c.id)).map(city => (
                  <div key={city.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full blur-xl opacity-20 ${
                      city.risk === 'Critical' ? 'bg-red-500' : city.risk === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-bold text-lg text-slate-200">{city.name}</div>
                      <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          city.risk === 'Critical' ? 'bg-red-400' : city.risk === 'High' ? 'bg-orange-400' : 'bg-yellow-400'
                        }`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${
                          city.risk === 'Critical' ? 'bg-red-500' : city.risk === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}></span>
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Active Cases</span>
                        <span className="font-mono text-white font-bold">{city.cases}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Risk Level</span>
                        <span className={`font-mono text-xs uppercase font-bold ${
                          city.risk === 'Critical' ? 'text-red-400' : city.risk === 'High' ? 'text-orange-400' : 'text-yellow-400'
                        }`}>{city.risk}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-700">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Top Vector</div>
                        <div className="text-xs text-slate-300 truncate" title={city.topScam}>{city.topScam}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center text-slate-500 text-xs uppercase tracking-widest font-mono">
                Lite Map Fallback Mode Active
              </div>
            </div>
          )}
       </div>
    </div>
  );
}
