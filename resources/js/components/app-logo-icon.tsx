import type { ComponentProps } from 'react';

export default function AppLogoIcon(props: ComponentProps<'img'>) {
    return (
        <img {...props} src="/icon_profile.png" alt="Diordty icon" />
    );
}
