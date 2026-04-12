import Navbar from '@/components/mycomponents/Navbar';
import Hero from '@/components/mycomponents/Hero';
import ShapeGrid from '@/components/mycomponents/ShapeGrid';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Home" />
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                {/* <ShapeGrid
                    speed={0.5}
                    squareSize={40}
                    direction="diagonal" // up, down, left, right, diagonal
                    borderColor="#fff"
                    hoverFillColor="#222"
                    shape="square" // square, hexagon, circle, triangle
                    hoverTrailAmount={0} // number of trailing hovered shapes (0 = no trail)
                /> */}
                <div className="pt-25">
                    <Hero />
                </div>
            </div>
        </>
    );
}
