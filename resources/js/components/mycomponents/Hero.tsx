import ProfileCard from '@/components/mycomponents/ProfileCard';
export default function Hero() {
    return (
        <div className="flex gap-4">
            <h1>Ini Hero</h1>
            <ProfileCard
                name="Dionisio Raditya"
                title="AI & Robotics Engineer"
                handle="dionisioraditya"
                status="Online"
                contactText="Contact Me"
                avatarUrl="myprofile.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                onContactClick={() => console.log('Contact clicked')}
                behindGlowColor="rgba(8, 8, 74, 1)"
                iconUrl="/assets/demo/iconpattern.png"
                behindGlowEnabled={false}
                innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
            />
        </div>
    );
}
