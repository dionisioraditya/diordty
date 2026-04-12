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
                showUserInfo={false}
                enableTilt={true}
                enableMobileTilt={true}
                onContactClick={() => console.log('Contact clicked')}
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                iconUrl="/assets/demo/iconpattern.png"
                behindGlowEnabled
                innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
            />
        </div>
    );
}
