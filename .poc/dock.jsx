import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, HelpCircle, ChevronDown } from 'lucide-react';

const CARDS_DATA = [
    {
        id: 'airtel',
        brand: 'airtel',
        title: '50%',
        subtitle: 'CASHBACK',
        bgClass: 'bg-gradient-to-br from-red-600 to-red-900',
        textColor: 'text-white'
    },
    {
        id: 'amazon',
        brand: 'amazon',
        title: '50%',
        subtitle: 'cashback',
        desc: 'hingga Rp100k',
        bgClass: 'bg-gradient-to-b from-[#131921] to-[#ff9900]',
        textColor: 'text-white'
    },
    {
        id: 'zomato',
        brand: 'zomato',
        title: '50%',
        subtitle: 'OFF',
        bgClass: 'bg-gradient-to-br from-gray-800 to-gray-950',
        textColor: 'text-[#f50]'
    }
];

const CARD_WIDTH = 220;
const SPACING = 160; // Disesuaikan agar lebih rapat dalam 3D
const CURVE_DEPTH = -100; // Translasi Z saat tidak aktif
const MAX_ROTATION_Y = 45; // Rotasi sumbu Y dalam derajat
const ACTIVATION_THRESHOLD = 100;

export default function App() {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isActivating, setIsActivating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const dragStartRef = useRef({ x: 0, y: 0 });
    const dragAxisRef = useRef(null);
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    const handleStart = (e) => {
        if (isActivating) return;
        setIsDragging(true);
        dragAxisRef.current = null;
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        dragStartRef.current = { x: clientX, y: clientY };
    };

    const handleMove = useCallback((e) => {
        if (!isDragging || isActivating) return;
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        const deltaX = clientX - dragStartRef.current.x;
        const deltaY = clientY - dragStartRef.current.y;

        if (!dragAxisRef.current) {
            dragAxisRef.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
        }

        if (dragAxisRef.current === 'x') {
            setDragOffset({ x: deltaX, y: 0 });
        } else if (dragAxisRef.current === 'y') {
            setDragOffset({ x: 0, y: Math.max(0, deltaY) });
        }
    }, [isDragging, isActivating]);

    const handleEnd = useCallback(() => {
        if (!isDragging || isActivating) return;
        setIsDragging(false);

        if (dragAxisRef.current === 'x') {
            const offsetRatio = dragOffset.x / SPACING;
            if (offsetRatio < -0.2 && currentIndex < CARDS_DATA.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else if (offsetRatio > 0.2 && currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
            }
        } else if (dragAxisRef.current === 'y') {
            if (dragOffset.y > ACTIVATION_THRESHOLD) {
                activateOffer();
                return;
            }
        }

        setDragOffset({ x: 0, y: 0 });
    }, [isDragging, isActivating, dragOffset, currentIndex]);

    const activateOffer = () => {
        setIsActivating(true);
        setDragOffset({ x: 0, y: 0 });

        setTimeout(() => {
            setShowSuccess(true);
            fireConfetti();
        }, 2500);
    };

    useEffect(() => {
        const handleMouseUp = () => handleEnd();
        const handleMouseMove = (e) => handleMove(e);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleMove, handleEnd]);

    const fireConfetti = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: 100 }, () => ({
            x: canvas.width / 2,
            y: canvas.height / 2 - 100,
            r: Math.random() * 6 + 2,
            dx: Math.random() * 10 - 5,
            dy: Math.random() * -10 - 5,
            color: ['#ff9900', '#ff0000', '#00ff00', '#0000ff', '#ff00ff'][Math.floor(Math.random() * 5)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngle: 0,
            tiltAngleInc: (Math.random() * 0.07) + 0.05
        }));

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            particles.forEach(p => {
                p.tiltAngle += p.tiltAngleInc;
                p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle) * 2;
                p.dy += 0.1;
                p.x += p.dx;
                p.y += p.dy;

                if (p.y <= canvas.height) active = true;

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
                ctx.stroke();
            });

            if (active) requestAnimationFrame(render);
        };
        render();
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-black font-sans text-white overflow-hidden">
            <div className="relative flex h-full max-h-[850px] w-full max-w-[400px] flex-col overflow-hidden bg-[#0f0f0f]">
                
                <header className="z-10 flex items-center justify-between p-6">
                    <button className="text-white" onClick={() => window.location.reload()}>
                        <X size={24} strokeWidth={2.5} />
                    </button>
                    <span className="text-sm font-semibold tracking-wide text-gray-300">S&K</span>
                </header>

                <div className={`z-10 mt-2 flex flex-col items-center transition-opacity duration-300 ${isActivating ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="mb-2 text-red-500">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9H3a1 1 0 0 1-.7-1.7l1.38-1.55A3.981 3.981 0 0 1 6.64 6H9.5a3.5 3.5 0 1 1 5 0h2.86c1.13 0 2.19.48 2.96 1.3l1.38 1.55A1 1 0 0 1 21 12h-1zm-9 8v-8H6v8h5zm2 0h5v-8h-5v8zm0-10h4.4l-1.07-1.2a2 2 0 0 0-1.49-.65H13v1.85zm-2 0V8.15H8.16c-.55 0-1.08.23-1.49.65L5.6 10H11zM9.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
                    </div>
                    <h1 className="w-48 text-center text-2xl font-bold leading-tight">Pilih hadiah sambutan Anda</h1>
                </div>

                <div 
                    ref={containerRef}
                    className="card-container relative mt-8 flex flex-1 items-center justify-center"
                    style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                    onMouseDown={handleStart}
                    onTouchStart={handleStart}
                >
                    
                    <div 
                        className={`absolute h-[350px] w-[230px] rounded-[20px] border-[3px] border-orange-500/80 shadow-[0_0_20px_rgba(255,153,0,0.5),inset_0_0_15px_rgba(255,153,0,0.3)] pointer-events-none transition-opacity duration-300 z-10 ${isActivating ? 'opacity-0' : 'opacity-100'}`}
                        style={{
                            boxShadow: '0 0 40px rgba(255,153,0,0.4)',
                        }}
                    />

                    {CARDS_DATA.map((card, index) => {
                        const offsetRatio = dragOffset.x / SPACING;
                        const distanceFromCenter = index - currentIndex + offsetRatio;
                        
                        // Logika Carousel 3D (Silinder)
                        let x = distanceFromCenter * SPACING;
                        
                        // Menghitung rotasi Y (memutar kartu menjauhi penonton)
                        // Kartu di kiri rotasi positif, kartu di kanan rotasi negatif
                        let rotateY = -distanceFromCenter * MAX_ROTATION_Y; 
                        
                        // Menghitung kedalaman (Z). Semakin jauh dari tengah, semakin ke belakang (negatif)
                        let z = -Math.abs(distanceFromCenter) * Math.abs(CURVE_DEPTH);
                        
                        // Mengatur tinggi/Y agar tetap sejajar di tengah
                        let y = 0; 
                        
                        let scale = 1; // Skala diatur oleh perspektif Z, tidak perlu scale 2D lagi
                        let zIndex = Math.round(100 - Math.abs(distanceFromCenter) * 10);
                        
                        // Opacity menurun perlahan untuk kartu yang jauh
                        let opacity = Math.max(0, Math.min(1, 1 - Math.abs(distanceFromCenter) * 0.5));

                        // Logika saat ditarik ke bawah (Aktivasi)
                        if (dragAxisRef.current === 'y' && dragOffset.y > 0 && Math.abs(distanceFromCenter) < 0.5) {
                            y += dragOffset.y;
                            z += dragOffset.y * 0.5; // Sedikit maju saat ditarik
                        }

                        // Logika saat state aktivasi sukses (kartu hilang/tampil)
                        if (isActivating) {
                            if (index !== currentIndex) {
                                x = (index - currentIndex) * (SPACING * 2);
                                z = -500;
                                rotateY = (index - currentIndex) * 60;
                                opacity = 0;
                            } else {
                                x = 0;
                                y = 40;
                                z = 50;
                                rotateY = 0;
                                zIndex = 50;
                                opacity = showSuccess ? 0 : 1;
                            }
                        }

                        return (
                            <div
                                key={card.id}
                                className={`absolute flex h-[340px] w-[220px] flex-col overflow-hidden rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] will-change-transform ${card.bgClass} ${isDragging ? '' : 'transition-all duration-400 ease-out'} ${isActivating && index === currentIndex ? 'transition-all duration-500' : ''}`}
                                style={{
                                    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg)`,
                                    opacity,
                                    zIndex
                                }}
                            >
                                <div className={`mb-auto text-xl font-bold tracking-tighter ${card.brand === 'zomato' ? card.textColor : 'text-white'}`}>
                                    {card.brand}
                                </div>
                                
                                {card.id === 'amazon' ? (
                                    <>
                                        <div className="flex-1"></div>
                                        <div className="z-10 mb-8 text-center">
                                            <div className="text-4xl font-black text-white">{card.title}</div>
                                            <div className="text-sm font-semibold tracking-wide text-white">{card.subtitle}</div>
                                            <div className="mt-1 text-xs text-white/80">{card.desc}</div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 flex h-[40%] w-full items-end justify-center rounded-t-[100%] bg-[#ff9900] pb-4">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#131921" strokeWidth="2"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mt-4 text-3xl font-black leading-none text-white">
                                            {card.title}<br/><span className="text-lg font-bold">{card.subtitle}</span>
                                        </div>
                                        {card.id === 'airtel' && (
                                            <div className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-full bg-white/10"></div>
                                        )}
                                        {card.id === 'zomato' && (
                                            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full border-4 border-[#f50]/20"></div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className={`z-10 flex flex-col items-center pb-12 transition-opacity duration-300 ${isActivating ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="mb-2 flex flex-col items-center">
                        <ChevronDown className="animate-bounce text-orange-500" size={24} strokeWidth={3} />
                        <ChevronDown className="-mt-4 animate-bounce text-orange-500 delay-150" size={24} strokeWidth={3} />
                    </div>
                    <p className="text-xs font-semibold tracking-wide text-gray-400">Tarik ke bawah untuk mengaktifkan penawaran</p>
                </div>

                <div className={`absolute inset-0 z-40 flex flex-col bg-black/85 px-6 pt-6 backdrop-blur-md transition-opacity duration-300 ${isActivating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <header className="flex w-full items-center justify-between">
                        <button className="p-2 text-white" onClick={() => window.location.reload()}>
                            <X size={20} strokeWidth={2.5} />
                        </button>
                        <span className="text-sm font-semibold tracking-wide text-gray-300">Bantuan</span>
                    </header>

                    {!showSuccess && (
                        <div className="flex flex-1 -mt-20 flex-col items-center justify-center transition-opacity duration-300">
                            <div className="mb-6 text-red-500">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9H3a1 1 0 0 1-.7-1.7l1.38-1.55A3.981 3.981 0 0 1 6.64 6H9.5a3.5 3.5 0 1 1 5 0h2.86c1.13 0 2.19.48 2.96 1.3l1.38 1.55A1 1 0 0 1 21 12h-1zm-9 8v-8H6v8h5zm2 0h5v-8h-5v8zm0-10h4.4l-1.07-1.2a2 2 0 0 0-1.49-.65H13v1.85zm-2 0V8.15H8.16c-.55 0-1.08.23-1.49.65L5.6 10H11zM9.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
                            </div>
                            <h2 className="w-64 text-center text-xl font-bold text-orange-500">Mengaktifkan penawaran untuk Anda...</h2>
                            <div className="mt-12 h-1 w-48 overflow-hidden rounded-full bg-gray-800">
                                <div className="h-full w-full origin-left bg-orange-500 animate-[scaleX_2s_ease-in-out_forwards]" style={{ transform: 'scaleX(0)' }}>
                                    <style>{`
                                        @keyframes scaleX { to { transform: scaleX(1); } }
                                    `}</style>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`absolute inset-0 z-50 flex flex-col p-6 pt-24 transition-opacity duration-500 ${showSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="relative overflow-hidden rounded-3xl bg-[#1a202c] p-6 shadow-[0_0_40px_rgba(255,153,0,0.3)]">
                            <div className="mb-8 flex items-center space-x-2">
                                <span className="text-lg font-bold">amazon</span>
                            </div>
                            
                            <div className="mb-2 text-5xl font-black text-white">50%</div>
                            <div className="mb-8 text-2xl font-bold text-white">cashback</div>

                            <div className="mb-4 text-sm text-gray-400">Gunakan FamCard untuk berbelanja di Amazon</div>
                            
                            <div className="flex w-fit items-center space-x-2 rounded-full bg-gray-800/50 px-4 py-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                <span className="text-xs font-semibold text-yellow-500">Berakhir pada 27 Jan</span>
                            </div>

                            <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-[#ff9900]/20 blur-2xl"></div>
                        </div>

                        <div className="mt-8">
                            <h3 className="mb-4 text-sm font-bold">Bagaimana cara mendapatkan cashback?</h3>
                            <div className="flex items-start space-x-4">
                                <div className="mt-1 text-xl font-black text-gray-500">1</div>
                                <p className="text-sm font-medium text-gray-300">Gunakan FamCard untuk berbelanja di <span className="font-bold text-white">Amazon</span></p>
                            </div>
                        </div>

                        <div className="mb-6 mt-auto">
                            <button className="w-full rounded-full bg-[#ff9900] py-4 text-lg font-bold text-black shadow-[0_0_20px_rgba(255,153,0,0.4)]">
                                Pesan dari Amazon
                            </button>
                        </div>
                    </div>
                </div>

                <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-50"></canvas>
            </div>
        </div>
    );
}