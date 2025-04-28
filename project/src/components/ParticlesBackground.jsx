import { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesBackground = () => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  return (
    <div 
      className="fixed inset-0 transition-opacity duration-[3000ms] pointer-events-none"
      style={{ opacity }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: true,
            zIndex: -1
          },
          background: {
            color: {
              value: 'transparent'
            }
          },
          fpsLimit: 30,
          particles: {
            color: {
              value: '#ffffff'
            },
            links: {
              enable: false
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'out'
              },
              random: true,
              speed: 0.1,
              straight: false
            },
            number: {
              density: {
                enable: true,
                area: 1500
              },
              value: 10,
              limit: 12
            },
            opacity: {
              value: 0.05,
              animation: {
                enable: false
              }
            },
            shape: {
              type: 'circle'
            },
            size: {
              value: { min: 1, max: 2 },
              animation: {
                enable: false
              }
            }
          },
          detectRetina: false,
          smooth: true
        }}
      />
    </div>
  );
};

export default ParticlesBackground;