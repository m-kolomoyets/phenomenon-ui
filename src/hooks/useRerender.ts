import { useEffect, useState } from 'react';

export const useRerender = (canRerender: boolean) => {
    const [, setRerendered] = useState(false);

    useEffect(() => {
        if (canRerender) {
            setRerendered(true);
        }

        return () => {
            setRerendered(false);
        };
    }, [canRerender]);
};
