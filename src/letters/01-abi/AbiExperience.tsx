import React, {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  Canvas,
  useFrame,
} from '@react-three/fiber'

import {
  Environment,
  Sparkles,
  Stars,
  useGLTF,
} from '@react-three/drei'

import * as THREE from 'three'

import {
  clone as cloneSkeleton,
} from 'three/examples/jsm/utils/SkeletonUtils.js'

import gsap from 'gsap'
import {
  ScrollTrigger,
} from 'gsap/ScrollTrigger'

gsap.registerPlugin(
  ScrollTrigger,
)

/* =========================================================
   PHOENIX ASSET
========================================================= */

const PHOENIX_PATH =
  `${import.meta.env.BASE_URL}assets/01-abi/phoenix/phoenix.glb`

/* =========================================================
   MEMORIES
========================================================= */

const memories = [
  {
    image:
      '/assets/01-abi/photos/memory-01.webp',

    caption:
      'Some ordinary days become the memories we keep the longest.',

    detail:
      'The stupid jokes. The random rides. The conversations that started nowhere and somehow ended everywhere.',
  },

  {
    image:
      '/assets/01-abi/photos/memory-02.webp',

    caption:
      'The moments that never asked to become important somehow did.',

    detail:
      'Kadang kita pergi keluar tanpa tahu mau ke mana. Tidak ada tujuan. Tidak ada rencana. Random saja semuanya.',
  },

  {
    image:
      '/assets/01-abi/photos/memory-03.webp',

    caption:
      'Somewhere along the way, you became family.',

    detail:
      'Awalnya hanya teman kampus. Entah bagaimana, sekarang rasanya kamu sudah seperti adik, bahkan kadang seperti kakak.',
  },
]

/* =========================================================
   STAR SEA
========================================================= */

function StarSea() {
  const group =
    useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) {
      return
    }

    const time =
      state.clock.elapsedTime

    group.current.rotation.y =
      time * 0.008

    group.current.rotation.x =
      Math.sin(
        time * 0.08,
      ) * 0.025
  })

  return (
    <group ref={group}>
      <Stars
        radius={90}
        depth={55}
        count={1800}
        factor={2.2}
        saturation={0}
        fade
        speed={0.25}
      />

      <Sparkles
        count={220}
        scale={[
          18,
          12,
          28,
        ]}
        size={1.8}
        speed={0.18}
        opacity={0.55}
        color="#ff8b55"
      />

      <Sparkles
        count={80}
        scale={[
          9,
          7,
          16,
        ]}
        size={3}
        speed={0.1}
        opacity={0.3}
        color="#ff3d00"
      />
    </group>
  )
}

/* =========================================================
   WORLD FIRE PARTICLES
========================================================= */

function FireWorld() {
  const points =
    useRef<THREE.Points>(null)

  const count = 300

  const data =
    useMemo(() => {
      const positions =
        new Float32Array(
          count * 3,
        )

      const speeds =
        new Float32Array(
          count,
        )

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const i3 =
          i * 3

        positions[i3] =
          (Math.random() -
            0.5) *
          18

        positions[i3 + 1] =
          (Math.random() -
            0.5) *
          10

        positions[i3 + 2] =
          (Math.random() -
            0.5) *
          22

        speeds[i] =
          0.2 +
          Math.random() *
            0.7
      }

      return {
        positions,
        speeds,
      }
    }, [])

  useFrame(
    (
      _state,
      delta,
    ) => {
      if (!points.current) {
        return
      }

      const attribute =
        points.current.geometry
          .attributes.position

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const index =
          i * 3 + 1

        let y =
          attribute.array[
            index
          ] as number

        y +=
          data.speeds[i] *
          delta

        if (y > 5) {
          y = -5
        }

        attribute.array[
          index
        ] = y
      }

      attribute.needsUpdate =
        true
    },
  )

  return (
    <points
      ref={points}
      frustumCulled={false}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            data.positions,
            3,
          ]}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.045}
        color="#ff7a38"
        transparent
        opacity={0.8}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/* =========================================================
   PHOENIX ORBITING FIRE ORBS
========================================================= */

function PhoenixFireOrbs() {
  const group =
    useRef<THREE.Group>(null)

  const orbCount = 7

  const orbs = useMemo(
    () =>
      Array.from(
        {
          length:
            orbCount,
        },
        (_, index) => ({
          angle:
            (index /
              orbCount) *
            Math.PI *
            2,

          radius:
            1.7 +
            (index % 2) *
              0.22,

          y:
            0.05 +
            (index % 3) *
              0.22,

          speed:
            0.55 +
            (index % 3) *
              0.08,

          phase:
            index * 0.9,
        }),
      ),
    [],
  )

  useFrame(
    ({
      clock,
    }) => {
      if (!group.current) {
        return
      }

      const time =
        clock.elapsedTime

      group.current.rotation.y =
        time * 0.18

      group.current.children.forEach(
        (
          child,
          index,
        ) => {
          const data =
            orbs[index]

          if (!data) {
            return
          }

          const angle =
            data.angle +
            time *
              data.speed

          const radius =
            data.radius +
            Math.sin(
              time * 1.5 +
                data.phase,
            ) *
              0.12

          child.position.x =
            Math.cos(angle) *
            radius

          child.position.z =
            Math.sin(angle) *
            radius

          child.position.y =
            data.y +
            Math.sin(
              time * 1.8 +
                data.phase,
            ) *
              0.32
        },
      )
    },
  )

  return (
    <group ref={group}>
      {orbs.map(
        (_, index) => (
          <group
            key={index}
          >
            <mesh>
              <sphereGeometry
                args={[
                  0.075,
                  8,
                  8,
                ]}
              />

              <meshBasicMaterial
                color="#fff4d6"
              />
            </mesh>

            <mesh>
              <sphereGeometry
                args={[
                  0.15,
                  8,
                  8,
                ]}
              />

              <meshBasicMaterial
                color="#ff6a21"
                transparent
                opacity={0.7}
                depthWrite={false}
                blending={
                  THREE.AdditiveBlending
                }
              />
            </mesh>

            <mesh>
              <sphereGeometry
                args={[
                  0.28,
                  8,
                  8,
                ]}
              />

              <meshBasicMaterial
                color="#ff3200"
                transparent
                opacity={0.12}
                depthWrite={false}
                blending={
                  THREE.AdditiveBlending
                }
              />
            </mesh>
          </group>
        ),
      )}
    </group>
  )
}

/* =========================================================
   PHOENIX FIRE TRAIL
========================================================= */

function PhoenixFireTrail() {
  const points =
    useRef<THREE.Points>(null)

  const count = 150

  const particles =
    useMemo(() => {
      const positions =
        new Float32Array(
          count * 3,
        )

      const velocity =
        new Float32Array(
          count * 3,
        )

      const side =
        new Float32Array(
          count,
        )

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const i3 =
          i * 3

        const wingSide =
          i % 2 === 0
            ? -1
            : 1

        side[i] =
          wingSide

        positions[i3] =
          wingSide *
          (0.7 +
            Math.random() *
              1.1)

        positions[i3 + 1] =
          0.05 +
          Math.random() *
            1.4

        positions[i3 + 2] =
          (Math.random() -
            0.5) *
          0.65

        velocity[i3] =
          -wingSide *
          (0.15 +
            Math.random() *
              0.35)

        velocity[i3 + 1] =
          0.15 +
          Math.random() *
            0.35

        velocity[i3 + 2] =
          (Math.random() -
            0.5) *
          0.2
      }

      return {
        positions,
        velocity,
        side,
      }
    }, [])

  useFrame(
    ({
      clock,
    }, delta) => {
      if (!points.current) {
        return
      }

      const attribute =
        points.current.geometry
          .attributes.position

      const time =
        clock.elapsedTime

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const i3 =
          i * 3

        let x =
          attribute.array[
            i3
          ] as number

        let y =
          attribute.array[
            i3 + 1
          ] as number

        let z =
          attribute.array[
            i3 + 2
          ] as number

        const wingSide =
          particles.side[i]

        x +=
          particles.velocity[
            i3
          ] *
          delta

        y +=
          particles.velocity[
            i3 + 1
          ] *
          delta

        z +=
          particles.velocity[
            i3 + 2
          ] *
          delta

        x +=
          Math.sin(
            time * 4 +
              i * 0.73,
          ) *
          delta *
          0.08

        z +=
          Math.cos(
            time * 3.5 +
              i * 0.41,
          ) *
          delta *
          0.08

        if (
          Math.abs(x) >
            2.5 ||
          y > 2.8
        ) {
          x =
            wingSide *
            (0.7 +
              Math.random() *
                0.7)

          y =
            0.15 +
            Math.random() *
              1.1

          z =
            (Math.random() -
              0.5) *
            0.5
        }

        attribute.array[
          i3
        ] = x

        attribute.array[
          i3 + 1
        ] = y

        attribute.array[
          i3 + 2
        ] = z
      }

      attribute.needsUpdate =
        true
    },
  )

  return (
    <points
      ref={points}
      frustumCulled={false}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            particles.positions,
            3,
          ]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#ff4b1a"
        size={0.065}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={
          THREE.AdditiveBlending
        }
        sizeAttenuation
      />
    </points>
  )
}

/* =========================================================
   PHOENIX
========================================================= */

function Phoenix() {
  const groupRef =
    useRef<THREE.Group>(null)

  const modelRef =
    useRef<THREE.Group>(null)

  const { scene } =
    useGLTF(
      PHOENIX_PATH,
    )

  const phoenix =
    useMemo(() => {
      const clone =
        cloneSkeleton(scene)

      clone.updateMatrixWorld(
        true,
      )

      const originalBox =
        new THREE.Box3().setFromObject(
          clone,
        )

      const originalCenter =
        new THREE.Vector3()

      const originalSize =
        new THREE.Vector3()

      originalBox.getCenter(
        originalCenter,
      )

      originalBox.getSize(
        originalSize,
      )

      const largestDimension =
        Math.max(
          originalSize.x,
          originalSize.y,
          originalSize.z,
        )

      const targetSize = 5

      const scale =
        targetSize /
        largestDimension

      clone.scale.setScalar(
        scale,
      )

      clone.position.set(
        -originalCenter.x *
          scale,

        -originalCenter.y *
          scale,

        -originalCenter.z *
          scale,
      )

      clone.traverse(
        (
          object,
        ) => {
          if (
            !(
              object instanceof
              THREE.Mesh
            )
          ) {
            return
          }

          object.visible = true

          object.frustumCulled =
            false

          object.castShadow =
            false

          object.receiveShadow =
            false

          object.renderOrder =
            10

          if (
            Array.isArray(
              object.material,
            )
          ) {
            object.material =
              object.material.map(
                (
                  material,
                ) => {
                  const mat =
                    material.clone()

                  mat.side =
                    THREE.DoubleSide

                  mat.depthTest =
                    true

                  mat.depthWrite =
                    true

                  if (
                    'emissive' in
                    mat
                  ) {
                    mat.emissive =
                      new THREE.Color(
                        '#ff3214',
                      )

                    mat.emissiveIntensity =
                      0.5
                  }

                  return mat
                },
              )
          } else if (
            object.material
          ) {
            const mat =
              object.material.clone()

            mat.side =
              THREE.DoubleSide

            mat.depthTest =
              true

            mat.depthWrite =
              true

            if (
              'emissive' in
              mat
            ) {
              mat.emissive =
                new THREE.Color(
                  '#ff3214',
                )

              mat.emissiveIntensity =
                0.5
            }

            object.material =
              mat
          }
        },
      )

      return clone
    }, [scene])

  useFrame(
    ({
      clock,
    }) => {
      if (
        !groupRef.current ||
        !modelRef.current
      ) {
        return
      }

      const time =
        clock.elapsedTime

      const flightSpeed =
        0.22

      const angle =
        time * flightSpeed

      const radiusX = 2.15

      const radiusZ = 1.25

      groupRef.current.position.x =
        Math.sin(angle) *
        radiusX

      groupRef.current.position.z =
        Math.cos(angle) *
        radiusZ

      groupRef.current.position.y =
        0.1 +
        Math.sin(
          time * 1.1,
        ) *
          0.3

      groupRef.current.rotation.y =
        angle +
        Math.PI

      groupRef.current.rotation.z =
        Math.sin(angle) *
        0.18

      groupRef.current.rotation.x =
        Math.sin(
          time * 0.9,
        ) *
          0.05

      modelRef.current.rotation.y =
        Math.sin(
          time * 0.55,
        ) *
          0.035

      modelRef.current.position.y =
        Math.sin(
          time * 1.7,
        ) *
          0.035
    },
  )

  return (
    <group
      ref={groupRef}
    >
      <group
        ref={modelRef}
      >
        <primitive
          object={phoenix}
        />
      </group>

      <PhoenixFireOrbs />

      <PhoenixFireTrail />

      <pointLight
        color="#ff3512"
        intensity={8}
        distance={9}
        decay={2}
      />

      <pointLight
        color="#ff9b45"
        intensity={4}
        distance={6}
        decay={2}
      />
    </group>
  )
}

useGLTF.preload(
  PHOENIX_PATH,
)

/* =========================================================
   WORLD
========================================================= */

function World({
  progress,
}: {
  progress: React.MutableRefObject<number>
}) {
  const target =
    useRef(
      new THREE.Vector3(),
    )

  useFrame(
    ({ camera }) => {
      const p =
        progress.current

      const desiredX =
        Math.sin(
          p * Math.PI * 1.5,
        ) * 1.2

      const desiredY =
        Math.sin(
          p * Math.PI,
        ) * 0.45

      const desiredZ =
        8.5 -
        p * 1.3

      camera.position.x =
        THREE.MathUtils.lerp(
          camera.position.x,
          desiredX,
          0.035,
        )

      camera.position.y =
        THREE.MathUtils.lerp(
          camera.position.y,
          desiredY,
          0.035,
        )

      camera.position.z =
        THREE.MathUtils.lerp(
          camera.position.z,
          desiredZ,
          0.035,
        )

      target.current.set(
        0,
        0,
        0,
      )

      camera.lookAt(
        target.current,
      )
    },
  )

  return (
    <>
      <color
        attach="background"
        args={[
          '#030107',
        ]}
      />

      <fog
        attach="fog"
        args={[
          '#08050a',
          10,
          34,
        ]}
      />

      <ambientLight
        intensity={1.15}
      />

      <directionalLight
        position={[
          5,
          7,
          9,
        ]}
        intensity={2.8}
        color="#ffe0d0"
      />

      <directionalLight
        position={[
          -5,
          3,
          5,
        ]}
        intensity={1.8}
        color="#ff6b3d"
      />

      <pointLight
        position={[
          0,
          3,
          4,
        ]}
        intensity={5}
        distance={15}
        decay={2}
        color="#ff552d"
      />

      <StarSea />

      <FireWorld />

      <Suspense
        fallback={
          <Sparkles
            count={120}
            scale={[
              5,
              5,
              5,
            ]}
            size={2}
            speed={0.4}
            color="#ff7137"
          />
        }
      >
        <Phoenix />
      </Suspense>

      <Environment
        preset="night"
      />
    </>
  )
}

/* =========================================================
   FLOATING EMBERS
========================================================= */

function FloatingEmbers() {
  const embers =
    useMemo(
      () =>
        Array.from(
          {
            length: 34,
          },
          (_, index) => ({
            left:
              Math.random() *
              100,

            delay:
              Math.random() *
              8,

            duration:
              7 +
              Math.random() *
                8,

            size:
              2 +
              Math.random() *
                4,

            drift:
              -60 +
              Math.random() *
                120,

            opacity:
              0.2 +
              Math.random() *
                0.65,

            index,
          }),
        ),
      [],
    )

  return (
    <div className="floating-embers">
      {embers.map(
        (ember) => (
          <span
            key={
              ember.index
            }
            className="ember"
            style={{
              left: `${ember.left}%`,
              animationDelay: `${ember.delay}s`,
              animationDuration: `${ember.duration}s`,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              opacity:
                ember.opacity,
              ['--drift' as string]: `${ember.drift}px`,
            }}
          />
        ),
      )}
    </div>
  )
}

/* =========================================================
   MAIN EXPERIENCE
========================================================= */

export function AbiExperience() {
  const progress =
    useRef(0)

  const [
    started,
    setStarted,
  ] = useState(false)

  const [
    sound,
    setSound,
  ] = useState(false)

  const [
    activeMemory,
    setActiveMemory,
  ] = useState(0)

  const stageRef =
    useRef<HTMLDivElement>(
      null,
    )

  const introRef =
    useRef<HTMLDivElement>(
      null,
    )

  const introButtonRef =
    useRef<HTMLButtonElement>(
      null,
    )

  const introFlareRef =
    useRef<HTMLDivElement>(
      null,
    )

  const enterExperience =
    () => {
      if (
        !introRef.current
      ) {
        setStarted(true)
        return
      }

      const tl =
        gsap.timeline({
          onComplete: () =>
            setStarted(true),
        })

      tl.to(
        '.intro-kicker',
        {
          opacity: 0,
          y: -18,
          duration: 0.35,
        },
      )

      tl.to(
        '.intro-title-line',
        {
          letterSpacing:
            '0.35em',
          opacity: 0,
          y: -35,
          duration: 0.65,
          stagger: 0.08,
          ease:
            'power3.in',
        },
        '<',
      )

      tl.to(
        '.intro-subtitle',
        {
          opacity: 0,
          y: 25,
          duration: 0.45,
        },
        '<0.05',
      )

      tl.to(
        '.intro-enter',
        {
          scale: 1.15,
          opacity: 0,
          duration: 0.4,
        },
        '<',
      )

      tl.to(
        '.intro-flare',
        {
          scale: 3.5,
          opacity: 1,
          duration: 1,
          ease:
            'power2.in',
        },
        '<',
      )

      tl.to(
        '.intro-portal',
        {
          scale: 8,
          opacity: 0,
          duration: 1.1,
          ease:
            'power3.in',
        },
        '<0.05',
      )

      tl.to(
        introRef.current,
        {
          opacity: 0,
          duration: 0.8,
          ease:
            'power2.inOut',
        },
        '-=0.45',
      )
    }

  /* =======================================================
     GSAP
  ======================================================= */

  useEffect(() => {
    if (!started) {
      return
    }

    const ctx =
      gsap.context(
        () => {
          ScrollTrigger.create(
            {
              trigger:
                '#experience-scroll',

              start:
                'top top',

              end:
                'bottom bottom',

              scrub: true,

              onUpdate:
                (self) => {
                  progress.current =
                    self.progress
                },
            },
          )

          gsap.fromTo(
            '.hero-copy',
            {
              opacity: 0,
              y: 80,
              scale: 0.96,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.5,
              ease:
                'power3.out',
            },
          )

          gsap.utils
            .toArray<HTMLElement>(
              '.memory-card',
            )
            .forEach(
              (
                card,
                index,
              ) => {
                gsap.fromTo(
                  card,
                  {
                    opacity: 0,
                    y: 120,
                    x:
                      index %
                        2 ===
                      0
                        ? -80
                        : 80,
                    rotate:
                      index %
                        2 ===
                      0
                        ? -8
                        : 8,
                    scale: 0.92,
                  },
                  {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    rotate:
                      index %
                        2 ===
                      0
                        ? -2
                        : 2,
                    scale: 1,
                    ease:
                      'power3.out',

                    scrollTrigger:
                      {
                        trigger:
                          card,

                        start:
                          'top 88%',

                        end:
                          'top 45%',

                        scrub: 1.2,

                        onEnter:
                          () =>
                            setActiveMemory(
                              index,
                            ),
                      },
                  },
                )

              },
            )

          gsap.utils
            .toArray<HTMLElement>(
              '.timeline-item',
            )
            .forEach(
              (
                item,
                index,
              ) => {
                gsap.fromTo(
                  item,
                  {
                    opacity: 0,
                    x:
                      index %
                        2 ===
                      0
                        ? -70
                        : 70,
                  },
                  {
                    opacity: 1,
                    x: 0,
                    ease:
                      'power3.out',

                    scrollTrigger:
                      {
                        trigger:
                          item,

                        start:
                          'top 82%',

                        end:
                          'top 50%',

                        scrub: 1,
                      },
                  },
                )
              },
            )

          gsap.fromTo(
            '.letter-panel',
            {
              clipPath:
                'inset(0 0 100% 0)',

              opacity: 0,

              y: 80,
            },
            {
              clipPath:
                'inset(0 0 0% 0)',

              opacity: 1,

              y: 0,

              ease:
                'power3.out',

              scrollTrigger:
                {
                  trigger:
                    '.letter-section',

                  start:
                    'top 78%',

                  end:
                    'top 25%',

                  scrub: 1.3,
                },
            },
          )

          gsap.utils
            .toArray<HTMLElement>(
              '.letter-paragraph',
            )
            .forEach(
              (
                paragraph,
                index,
              ) => {
                gsap.fromTo(
                  paragraph,
                  {
                    opacity: 0,
                    y: 28,
                    filter:
                      'blur(8px)',
                  },
                  {
                    opacity: 1,
                    y: 0,
                    filter:
                      'blur(0px)',
                    ease:
                      'power2.out',

                    delay:
                      index *
                      0.04,

                    scrollTrigger:
                      {
                        trigger:
                          paragraph,

                        start:
                          'top 88%',

                        end:
                          'top 62%',

                        scrub: 1,
                      },
                  },
                )
              },
            )

          gsap.fromTo(
            '.ending-phoenix-word',
            {
              opacity: 0,
              scale: 0.8,
              letterSpacing:
                '0.6em',
            },
            {
              opacity: 1,
              scale: 1,
              letterSpacing:
                '0.18em',
              ease:
                'power3.out',

              scrollTrigger:
                {
                  trigger:
                    '.ending-scene',

                  start:
                    'top 75%',

                  end:
                    'top 35%',

                  scrub: 1,
                },
            },
          )
        },
        stageRef,
      )

    return () => {
      ctx.revert()
    }
  }, [started])

  return (
    <div
      ref={stageRef}
      className="abi-experience"
    >
      {/* ===================================================
          INTRO / MEMORY PORTAL
      =================================================== */}

      {!started && (
        <div
          ref={introRef}
          className="intro-screen"
        >
          <div className="intro-noise" />

          <div className="intro-stars-layer" />

          <div
            ref={introFlareRef}
            className="intro-flare"
          />

          <div className="intro-portal" />

          <div className="intro-orbit orbit-one" />
          <div className="intro-orbit orbit-two" />
          <div className="intro-orbit orbit-three" />

          <div className="intro-fire-dust">
            {Array.from(
              {
                length: 18,
              },
            ).map(
              (_, index) => (
                <i
                  key={index}
                  style={{
                    ['--i' as string]:
                      index,
                  }}
                />
              ),
            )}
          </div>

          <div className="intro-content">
            <div className="intro-kicker">
              <span />
              39LETTERS · 01
              <span />
            </div>

            <div className="intro-title">
              <span className="intro-title-line">
                A MEMORY
              </span>

              <span className="intro-title-line intro-title-main">
                FOR ABI.
              </span>
            </div>

            <div className="intro-divider">
              <span />
              <b>✦</b>
              <span />
            </div>

            <p className="intro-subtitle">
              Not every person we meet
              is meant to stay.
              <br />
              Somehow, you did.
            </p>

            <button
              ref={
                introButtonRef
              }
              className="intro-enter"
              onClick={
                enterExperience
              }
            >
              <span className="enter-ring" />

              <span className="enter-label">
                <small>
                  STEP INTO
                </small>

                <strong>
                  OUR MEMORY
                </strong>
              </span>

              <span className="enter-arrow">
                ↓
              </span>
            </button>

            <p className="intro-footnote">
              Take your time.
              <br />
              This one is meant to
              be remembered.
            </p>
          </div>

          <div className="intro-bottom">
            <span>
              ABIDZAR
            </span>

            <span>
              THE ONE WHO
              STAYED
            </span>

            <span>
              01 / 07
            </span>
          </div>
        </div>
      )}

      {/* ===================================================
          EXPERIENCE
      =================================================== */}

      {started && (
        <>
          <div className="world-canvas">
            <Canvas
              camera={{
                position: [
                  0,
                  0,
                  8.5,
                ],

                fov: 45,

                near:
                  0.01,

                far:
                  1000,
              }}
              dpr={[
                1,
                1.5,
              ]}
              gl={{
                antialias:
                  true,

                alpha:
                  false,

                powerPreference:
                  'high-performance',
              }}
            >
              <World
                progress={
                  progress
                }
              />
            </Canvas>
          </div>

          <FloatingEmbers />

          <button
            className="sound-button"
            onClick={() =>
              setSound(
                (value) =>
                  !value,
              )
            }
          >
            <span
              className={
                sound
                  ? 'sound-dot active'
                  : 'sound-dot'
              }
            />

            {sound
              ? 'Sound on'
              : 'Sound off'}
          </button>

          <div
            id="experience-scroll"
          >
            {/* =================================================
                HERO
            ================================================= */}

            <section className="scene hero-scene">
              <div className="hero-vignette" />

              <div className="hero-copy">
                <p className="eyebrow">
                  FOR ABI
                </p>

                <h1>
                  The One Who
                  <br />
                  <em>Stayed.</em>
                </h1>

                <p className="hero-description">
                  Some people come
                  into your life.
                  Somehow, they
                  become family.
                </p>

                <div className="hero-line" />

                <span className="scroll-note">
                  <span className="scroll-dot" />
                  Scroll to enter
                  the story
                </span>
              </div>

              <div className="hero-side-note">
                <span>
                  ABIDZAR
                </span>

                <span>
                  01 — 07
                </span>
              </div>
            </section>

            {/* =================================================
                BEGINNING
            ================================================= */}

            <section className="scene reveal-scene">
              <div className="scene-label">
                <span>
                  01
                </span>

                <p>
                  THE BEGINNING
                </p>
              </div>

              <div className="reveal-copy">
                <p className="mini-eyebrow">
                  BEFORE YOU BECAME
                  FAMILY
                </p>

                <h2>
                  At first,
                  <br />
                  you were just
                  <br />
                  <em>someone.</em>
                </h2>

                <p>
                  Kita hanya sebatas
                  kenal di kelas.
                  Kamu waktu itu
                  dengan tatapan iseng
                  menatapku tanpa
                  sekata yang keluar.
                </p>

                <p>
                  Aku bingung...
                  <br />
                  <span>
                    “Ada apa dengan anak
                    ini?”
                  </span>
                </p>

                <p>
                  Lalu aku juga salah
                  mengira kamu warga
                  lokal. Kamu membohongiku
                  dengan mengatakan bisa
                  bahasa Jawa karena
                  paman tinggal di Jawa.
                </p>

                <p className="quiet-line">
                  Ternyata pamanmu cuma
                  kuliah di sini.
                  <br />
                  Hmmm...
                </p>

                <div className="memory-pulse">
                  <span />
                  <span />
                  <span />
                </div>

                <p className="closing-thought">
                  Dan tanpa sadar,
                  <br />
                  kita mulai berteman.
                  <br />
                  <strong>
                    “Hanya sebatas
                    berteman.”
                  </strong>
                </p>
              </div>
            </section>

            {/* =================================================
                MEMORIES
            ================================================= */}

            <section className="scene memories-scene">
              <div className="section-heading">
                <p className="eyebrow">
                  MEMORIES
                </p>

                <h2>
                  Some days don't
                  <br />
                  look important
                  <br />
                  <em>until you look back.</em>
                </h2>

                <p>
                  And suddenly, every
                  ordinary moment has
                  a place in your heart.
                </p>
              </div>

              <div className="memory-stack">
                {memories.map(
                  (
                    memory,
                    index,
                  ) => (
                    <article
                      className={`memory-card memory-card-${index + 1} ${
                        activeMemory ===
                        index
                          ? 'is-active'
                          : ''
                      }`}
                      key={
                        memory.image
                      }
                    >
                      <div className="memory-image">
                        <div className="memory-glow" />

                        <img
                          src={
                            memory.image
                          }
                          alt=""
                          onError={(
                            event,
                          ) => {
                            event.currentTarget.style.display =
                              'none'
                          }}
                        />

                        <div className="photo-placeholder">
                          <span>
                            PHOTO{' '}
                            {String(
                              index +
                                1,
                            ).padStart(
                              2,
                              '0',
                            )}
                          </span>

                          <small>
                            Place your
                            memory here
                          </small>
                        </div>

                        <div className="photo-number">
                          0
                          {index +
                            1}
                        </div>
                      </div>

                      <div className="memory-caption">
                        <span>
                          MEMORY{' '}
                          {String(
                            index +
                              1,
                          ).padStart(
                            2,
                            '0',
                          )}
                        </span>

                        <p>
                          {
                            memory.caption
                          }
                        </p>

                        <small>
                          {
                            memory.detail
                          }
                        </small>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </section>

            {/* =================================================
                HOW WE GOT CLOSE
            ================================================= */}

            <section className="scene closeness-scene">
              <div className="closeness-copy">
                <p className="eyebrow">
                  SOMEHOW
                </p>

                <h2>
                  We didn't plan
                  <br />
                  to become
                  <br />
                  <em>this close.</em>
                </h2>

                <p>
                  Entah apa yang membuat
                  kita bisa dekat.
                </p>

                <p>
                  Tapi awal kedekatan
                  kita saat kamu mulai
                  mengajak pulang bareng
                  naik motorku.
                </p>

                <p>
                  Lalu kamu mau menginap
                  di rumahku, padahal
                  waktu itu kita tidak
                  sedekat itu.
                </p>

                <div className="quote-card">
                  <span>
                    “
                  </span>

                  <p>
                    Anehnya, aku tidak
                    merasa aneh atau
                    risih.
                    <br />
                    Malah langsung
                    setuju.
                  </p>

                  <span className="quote-end">
                    ”
                  </span>
                </div>

                <p>
                  Dan aku tidak pernah
                  menyangka semuanya
                  berlangsung hingga
                  sekarang.
                </p>

                <p className="forever-line">
                  Dan aku harap...
                  <br />
                  <strong>
                    bisa seterusnya.
                    Selamanya.
                  </strong>
                </p>
              </div>
            </section>

            {/* =================================================
                HABITS
            ================================================= */}

            <section className="scene habits-scene">
              <div className="habits-card">
                <div className="habits-top">
                  <span>
                    03
                  </span>

                  <span>
                    THINGS I KNOW
                  </span>
                </div>

                <h2>
                  The little things
                  <br />
                  that make you,
                  <br />
                  <em>you.</em>
                </h2>

                <div className="habit-row">
                  <span>
                    01
                  </span>

                  <p>
                    Kamu suka banget
                    main game. Kadang
                    sampai lupa diri.
                  </p>
                </div>

                <div className="habit-row">
                  <span>
                    02
                  </span>

                  <p>
                    Kadang kamu terlalu
                    bodo amat jadi orang.
                    Hampir tidak peduli
                    sekitar.
                  </p>
                </div>

                <div className="habit-row">
                  <span>
                    03
                  </span>

                  <p>
                    Dan entah kenapa,
                    setiap ngobrol,
                    awalnya bahas apa
                    malah bisa ke mana
                    mana.
                  </p>
                </div>

                <div className="habit-footer">
                  Random.
                  <br />
                  Tapi justru itu
                  yang membuatnya
                  menjadi kita.
                </div>
              </div>
            </section>

            {/* =================================================
                TIMELINE
            ================================================= */}

            <section className="scene timeline-scene">
              <div className="section-heading timeline-heading">
                <p className="eyebrow">
                  OUR STORY
                </p>

                <h2>
                  A journey
                  <br />
                  toward the
                  <br />
                  <em>fire.</em>
                </h2>
              </div>

              <div className="timeline">
                <div className="timeline-line">
                  <span />
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker">
                    01
                  </div>

                  <div>
                    <small>
                      THE FIRST DAYS
                    </small>

                    <h3>
                      When we were
                      just getting
                      to know each
                      other.
                    </h3>

                    <p>
                      Hanya teman kelas.
                      Hanya kenalan.
                      Belum ada yang
                      tahu ke mana semua
                      ini akan membawa
                      kita.
                    </p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker">
                    02
                  </div>

                  <div>
                    <small>
                      SOMEHOW
                    </small>

                    <h3>
                      Random jokes
                      became routines.
                    </h3>

                    <p>
                      Pulang bersama.
                      Menginap.
                      Pergi tanpa tujuan.
                      Bicara tentang
                      apa saja.
                    </p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker">
                    03
                  </div>

                  <div>
                    <small>
                      WITHOUT REALIZING IT
                    </small>

                    <h3>
                      You became
                      someone I could
                      call family.
                    </h3>

                    <p>
                      Bukan lagi sekadar
                      teman kampus.
                      Kamu menjadi adik.
                      Kadang kakak.
                      Dan seseorang yang
                      terasa seperti rumah.
                    </p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker phoenix-marker">
                    ✦
                  </div>

                  <div>
                    <small>
                      THE MOMENT
                    </small>

                    <h3>
                      And then life
                      tested us.
                    </h3>

                    <p>
                      Sampai akhirnya kita
                      melewati masa-masa
                      yang tidak pernah
                      kita bayangkan.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                HARD TIMES
            ================================================= */}

            <section className="scene hard-times-scene">
              <div className="hard-times-overlay" />

              <div className="hard-times-copy">
                <p className="eyebrow">
                  THE HARD PARTS
                </p>

                <h2>
                  There were moments
                  <br />
                  I wish I could
                  <br />
                  <em>erase.</em>
                </h2>

                <p>
                  Masalah terbesarku
                  mungkin ketika aku
                  mengalami permasalahan
                  internal dengan
                  keluargaku.
                </p>

                <p>
                  Waktu itu aku bahkan
                  tidak bisa ngomong ke
                  keluargaku sendiri.
                  Tapi kamu dan keluargamu
                  membantuku.
                </p>

                <p className="strong-memory">
                  Untuk pertama kalinya,
                  aku bisa mengeluarkan
                  sisi lemahnya diriku
                  di depanmu.
                  <br />
                  Bahkan sampai menangis.
                </p>

                <div className="hard-divider">
                  <span />
                  <b>
                    ✦
                  </b>
                  <span />
                </div>

                <p>
                  Lalu masa skripsian.
                  Banyak masalah menimpa
                  kita. Terutama kamu.
                </p>

                <p>
                  Sampai suatu hari aku
                  melihat kamu down.
                  Se-down-downnya.
                </p>

                <p className="accident-memory">
                  Dan yang sampai sekarang
                  tidak bisa kulupakan...
                  <br />
                  adalah ketika kita
                  mengalami kecelakaan
                  dan kamu harus
                  dioperasi.
                </p>

                <p>
                  Waktu itu aku sempat
                  berpikir,
                </p>

                <blockquote>
                  “Kayaknya lebih baik
                  aku mati aja deh
                  daripada melihat kamu
                  seperti itu.”
                </blockquote>

                <p>
                  Itu pertama kalinya aku
                  melihat kamu menangis,
                  meskipun aku tahu kamu
                  berusaha menyembunyikannya.
                </p>

                <p className="regret">
                  Penyesalan itu masih ada
                  hingga sekarang.
                </p>
              </div>
            </section>

            {/* =================================================
                GRATITUDE
            ================================================= */}

            <section className="scene gratitude-scene">
              <div className="gratitude-orbit">
                <span />
                <span />
                <span />
              </div>

              <div className="gratitude-copy">
                <p className="eyebrow">
                  WHAT I AM GRATEFUL FOR
                </p>

                <h2>
                  Maybe meeting you
                  <br />
                  was the part
                  <br />
                  I never knew
                  <br />
                  <em>I needed.</em>
                </h2>

                <p>
                  Dengan adanya kamu
                  hadir saja itu sudah
                  sebuah berkah luar biasa.
                </p>

                <p>
                  Sampai di titik aku
                  bersyukur banget
                  ketolak SNMPTN atau
                  SBMPTN di kampus negeri.
                </p>

                <p>
                  Karena ternyata,
                  jalan yang Tuhan berikan
                  membawaku ke tempat
                  di mana aku bisa bertemu
                  denganmu.
                </p>

                <div className="gratitude-final">
                  Jalan yang tidak
                  kurencanakan.
                  <br />
                  Tapi ternyata
                  <strong>
                    begitu indah.
                  </strong>
                </div>
              </div>
            </section>

            {/* =================================================
                WHY LITTLE BROTHER
            ================================================= */}

            <section className="scene brother-scene">
              <div className="brother-copy">
                <p className="eyebrow">
                  WHY YOU FEEL LIKE FAMILY
                </p>

                <h2>
                  You became
                  <br />
                  my little
                  <br />
                  <em>brother.</em>
                </h2>

                <p>
                  Aku belum pernah merasa
                  mendapatkan seseorang
                  yang awalnya asing namun
                  bisa sampai seperti ini.
                </p>

                <p>
                  Semua yang ada di kamu
                  sungguh berbeda dari
                  yang pernah aku temui.
                </p>

                <p>
                  Dengan latar belakangku
                  yang punya sedikit teman,
                  bahkan hampir tidak ada
                  yang kupercaya karena
                  pengalaman buruk dalam
                  berteman...
                </p>

                <p>
                  Aku pernah menjadi sasaran
                  bully sampai akhirnya
                  bisa melupakan mereka.
                </p>

                <p className="free-line">
                  Tapi kali ini...
                  <br />
                  aku bisa menjadi orang
                  lain yang bebas.
                </p>

                <p>
                  Bebas tanpa terikat
                  bayang-bayang traumaku.
                </p>
              </div>
            </section>

            {/* =================================================
                FEAR
            ================================================= */}

            <section className="scene fear-scene">
              <div className="fear-copy">
                <p className="eyebrow">
                  THE THING I FEAR
                </p>

                <h2>
                  Losing you
                  <br />
                  without realizing
                  <br />
                  <em>it happened.</em>
                </h2>

                <p>
                  Aku sangat takut saat
                  kita berselisih, berbeda
                  pendapat sampai
                  bertengkar.
                </p>

                <p>
                  Karena kamu adalah orang
                  yang berharga bagiku.
                </p>

                <p className="fear-strong">
                  Lebih takut lagi
                  kehilangan sosok seperti
                  kamu yang mampu berada
                  di sampingku di segala
                  kondisi.
                </p>

                <p>
                  Jujur saja...
                  aku takut lost contact.
                </p>

                <div className="fear-visual">
                  <span>
                    01
                  </span>

                  <i />

                  <span>
                    07
                  </span>
                </div>

                <p>
                  Takut tidak bisa bertemu.
                  <br />
                  Takut tidak ada jejak.
                  <br />
                  Takut suatu hari nanti
                  kita hanya menjadi
                  cerita yang pernah ada.
                </p>
              </div>
            </section>

            {/* =================================================
                LETTER
            ================================================= */}

            <section className="scene letter-section">
              <div className="letter-atmosphere" />

              <div className="letter-panel">
                <div className="letter-top">
                  <span>
                    39LETTERS
                  </span>

                  <span>
                    01 / ABI
                  </span>
                </div>

                <div className="letter-copy">
                  <p className="eyebrow">
                    THE LETTER
                  </p>

                  <h2>
                    Abi,
                  </h2>

                  <p className="letter-paragraph">
                    Aku sungguh-sungguh
                    berterima kasih banyak
                    kamu hadir di hidupku.
                  </p>

                  <p className="letter-paragraph">
                    Kamu salah seorang yang
                    aku takutkan kalau kita
                    sudah tidak bisa bertemu.
                    Kalau ternyata pertemuan
                    ini adalah pertemuan
                    terakhir.
                  </p>

                  <p className="letter-paragraph">
                    Kamu pernah bilang kamu
                    ingin bisa mengimbangiku,
                    tapi kamu merasa ada sisi
                    yang susah untuk
                    mengimbangi atau malas.
                  </p>

                  <p className="letter-paragraph">
                    Tapi asal kamu tahu...
                    <br />
                    <strong>
                      kamu selalu berada di
                      sampingku dan selalu bisa
                      mengimbangiku.
                    </strong>
                  </p>

                  <p className="letter-paragraph">
                    Jangan merasa rendah diri
                    dengan dirimu.
                  </p>

                  <p className="letter-paragraph">
                    Aku tahu tuntutan dari
                    orang tua dan sekitar itu
                    berat bagimu. Tapi tidak
                    perlu kamu menjadi orang
                    lain.
                  </p>

                  <p className="letter-paragraph">
                    Jadilah dirimu sendiri.
                    Kalau memang tidak suka,
                    bilang saja tidak suka.
                    Jangan menyembunyikannya.
                  </p>

                  <p className="letter-paragraph">
                    Jangan sampai kamu merasa
                    terbebani dengan hidupmu
                    sendiri.
                  </p>

                  <div className="letter-break">
                    <span />
                    <b>
                      ✦
                    </b>
                    <span />
                  </div>

                  <p className="letter-paragraph">
                    Mungkin aku agak bacot ke
                    kamu. Suka ngomel.
                    Mungkin kamu merasa risih
                    karena aku terlalu
                    mencampuri urusanmu.
                  </p>

                  <p className="letter-paragraph">
                    Sampai-sampai kamu tidak
                    mau lagi cerita ke aku,
                    mem-private aku, sementara
                    teman-teman lain tidak
                    kamu private.
                  </p>

                  <p className="letter-paragraph">
                    Jujur, aku merasa agak
                    sakit hati dan kepikiran.
                  </p>

                  <p className="letter-paragraph">
                    Kenapa kamu sampai begitu
                    ke aku?
                    <br />
                    Apakah memang aku tidak
                    bisa dipercaya?
                    <br />
                    Apa kata-kataku terlalu
                    menyakitimu?
                  </p>

                  <p className="letter-paragraph apology">
                    Tapi apapun itu...
                    <br />
                    <strong>
                      AKU MINTA MAAF
                      SEBESAR-BESARNYA
                      ATAS SEMUA KELAKUAN
                      DAN PERKATAANKU.
                    </strong>
                  </p>

                  <p className="letter-paragraph">
                    Jangan sampai lost contact.
                    Apalagi kita sudah tidak
                    bisa bertemu lagi.
                  </p>

                  <p className="letter-paragraph">
                    Aku bahkan bingung mau
                    kontak bagaimana karena
                    aku juga jarang main game.
                    Jadi kemungkinan lost
                    contact itu lebih besar
                    dibanding teman yang lain.
                  </p>

                  <p className="letter-paragraph">
                    Jadi...
                  </p>

                  <p className="letter-paragraph huge-message">
                    <strong>
                      JANGAN RAGU.
                    </strong>
                  </p>

                  <p className="letter-paragraph">
                    Kalau ada apapun,
                    sekecil apapun,
                    sering-seringlah
                    mengabari dan cerita
                    ke aku.
                  </p>

                  <p className="letter-paragraph">
                    Aku ingin suatu hari nanti
                    kita bisa merealisasikan
                    impian kita masing-masing
                    dan bisa lebih sering
                    ketemu.
                  </p>

                  <p className="letter-paragraph final-letter">
                    Karena dari semua hal yang
                    tidak pernah kurencanakan...
                    <br />
                    <br />
                    <strong>
                      bertemu denganmu adalah
                      salah satu yang paling
                      ingin aku pertahankan.
                    </strong>
                  </p>

                  <div className="signature-block">
                    <span>
                      With gratitude,
                    </span>

                    <strong>
                      — Rama
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                ENDING
            ================================================= */}

            <section className="scene ending-scene">
              <div className="ending-stars" />

              <div className="ending-copy">
                <p className="eyebrow">
                  UNTIL WE MEET AGAIN
                </p>

                <h2>
                  This isn't
                  <br />
                  <em>goodbye.</em>
                </h2>

                <p>
                  Karena keluarga tidak
                  selalu harus memiliki
                  nama belakang yang sama.
                </p>

                <p>
                  Kadang keluarga adalah
                  seseorang yang awalnya
                  bahkan tidak kita kenal.
                </p>

                <p>
                  Lalu tanpa sadar,
                  menjadi bagian dari
                  hidup yang paling kita
                  takut kehilangan.
                </p>

                <div className="ending-phoenix-word">
                  PHOENIX
                </div>

                <div className="ending-symbol">
                  ✦
                </div>

                <p className="ending-final">
                  Kalau suatu hari kita
                  terpisah oleh jarak,
                  waktu, kesibukan,
                  atau hidup...
                </p>

                <p className="ending-final strong">
                  semoga kita selalu
                  menemukan jalan untuk
                  pulang dan saling
                  mengabari.
                </p>

                <small>
                  39LETTERS · 01
                  <br />
                  FOR ABIDZAR AL-GIFFARI
                </small>
              </div>
            </section>
          </div>
        </>
      )}

      {/* =====================================================
          INLINE STYLES
      ===================================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .abi-experience {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #030107;
          color: #fff4ed;
          overflow-x: hidden;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .abi-experience button {
          font: inherit;
        }

        /* =====================================================
           INTRO
        ===================================================== */

        .intro-screen {
          position: fixed;
          inset: 0;
          z-index: 1000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at 50% 48%,
              rgba(255, 68, 20, .13),
              transparent 18%
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(117, 28, 10, .2),
              transparent 42%
            ),
            #030107;
        }

        .intro-noise {
          position: absolute;
          inset: -50%;
          opacity: .07;
          pointer-events: none;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
          animation: noiseMove 1s steps(2) infinite;
        }

        @keyframes noiseMove {
          0% {
            transform: translate(0,0);
          }
          25% {
            transform: translate(2%,-1%);
          }
          50% {
            transform: translate(-1%,2%);
          }
          75% {
            transform: translate(1%,1%);
          }
          100% {
            transform: translate(0,0);
          }
        }

        .intro-stars-layer {
          position: absolute;
          inset: 0;
          opacity: .6;
          background-image:
            radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(255,122,65,.55) 0 1px, transparent 1.5px);
          background-size:
            105px 105px,
            180px 180px;
          background-position:
            10px 20px,
            60px 90px;
          mask-image:
            radial-gradient(
              circle at center,
              black,
              transparent 75%
            );
          animation:
            starDrift 24s linear infinite;
        }

        @keyframes starDrift {
          from {
            transform: scale(1) translate3d(0,0,0);
          }

          to {
            transform: scale(1.12) translate3d(-2%,1%,0);
          }
        }

        .intro-flare {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 22vw;
          height: 22vw;
          min-width: 220px;
          min-height: 220px;
          transform: translate(-50%,-50%);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(255,240,202,.95) 0,
              rgba(255,111,38,.5) 8%,
              rgba(255,48,9,.16) 26%,
              transparent 68%
            );
          filter: blur(8px);
          animation:
            introPulse 4s ease-in-out infinite;
        }

        @keyframes introPulse {
          0%, 100% {
            transform:
              translate(-50%,-50%)
              scale(.82);
            opacity: .65;
          }

          50% {
            transform:
              translate(-50%,-50%)
              scale(1.15);
            opacity: 1;
          }
        }

        .intro-portal {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 180px;
          height: 180px;
          transform:
            translate(-50%,-50%);
          border-radius: 50%;
          border:
            1px solid rgba(255,128,67,.45);
          box-shadow:
            0 0 40px rgba(255,72,20,.18),
            inset 0 0 50px rgba(255,72,20,.1);
          animation:
            portalPulse 5s ease-in-out infinite;
        }

        .intro-portal::before,
        .intro-portal::after {
          content: "";
          position: absolute;
          inset: -35px;
          border-radius: 50%;
          border: 1px solid rgba(255,97,48,.12);
        }

        .intro-portal::after {
          inset: -75px;
          border-color:
            rgba(255,97,48,.06);
        }

        @keyframes portalPulse {
          0%,100% {
            transform:
              translate(-50%,-50%)
              scale(.9);
            opacity: .55;
          }

          50% {
            transform:
              translate(-50%,-50%)
              scale(1.12);
            opacity: 1;
          }
        }

        .intro-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(255,114,60,.13);
          border-radius: 50%;
          transform:
            translate(-50%,-50%)
            rotate(-20deg);
          pointer-events: none;
        }

        .orbit-one {
          width: 420px;
          height: 170px;
          animation:
            orbitA 14s linear infinite;
        }

        .orbit-two {
          width: 560px;
          height: 230px;
          transform:
            translate(-50%,-50%)
            rotate(45deg);
          animation:
            orbitB 18s linear infinite reverse;
        }

        .orbit-three {
          width: 760px;
          height: 310px;
          transform:
            translate(-50%,-50%)
            rotate(-55deg);
          animation:
            orbitA 25s linear infinite;
          opacity: .55;
        }

        @keyframes orbitA {
          from {
            transform:
              translate(-50%,-50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%,-50%)
              rotate(360deg);
          }
        }

        @keyframes orbitB {
          from {
            transform:
              translate(-50%,-50%)
              rotate(45deg);
          }

          to {
            transform:
              translate(-50%,-50%)
              rotate(405deg);
          }
        }

        .intro-fire-dust {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .intro-fire-dust i {
          position: absolute;
          left: calc(
            50% +
            (
              (var(--i) - 9)
              * 25px
            )
          );
          top: calc(
            50% +
            (
              sin(var(--i))
              * 50px
            )
          );
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #ff8a4c;
          box-shadow:
            0 0 10px #ff4218;
          animation:
            dustFloat
            calc(2.5s + var(--i) * .12s)
            ease-in-out
            infinite;
          animation-delay:
            calc(var(--i) * -.17s);
        }

        @keyframes dustFloat {
          0%,100% {
            transform:
              translate3d(0,30px,0)
              scale(.5);
            opacity: 0;
          }

          45% {
            opacity: .8;
          }

          100% {
            transform:
              translate3d(
                calc(
                  (var(--i) - 9) * 18px
                ),
                -110px,
                0
              )
              scale(1);
            opacity: 0;
          }
        }

        .intro-content {
          position: relative;
          z-index: 5;
          width: min(720px, 90vw);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .intro-kicker {
          display: flex;
          align-items: center;
          gap: 14px;
          color: rgba(255,205,183,.62);
          font-size: 10px;
          letter-spacing: .45em;
          text-transform: uppercase;
          margin-bottom: 35px;
        }

        .intro-kicker span {
          width: 34px;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,127,76,.7)
            );
        }

        .intro-kicker span:last-child {
          background:
            linear-gradient(
              90deg,
              rgba(255,127,76,.7),
              transparent
            );
        }

        .intro-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: .9;
        }

        .intro-title-line {
          display: block;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(38px, 7vw, 82px);
          font-weight: 400;
          letter-spacing: .18em;
          text-indent: .18em;
          color: #fff6f0;
          text-shadow:
            0 0 30px rgba(255,77,26,.18);
        }

        .intro-title-main {
          margin-top: 8px;
          font-style: italic;
          color: #ffb18d;
          text-shadow:
            0 0 35px rgba(255,65,20,.4);
        }

        .intro-divider {
          display: flex;
          align-items: center;
          gap: 18px;
          margin: 28px 0;
          width: min(300px, 70vw);
        }

        .intro-divider span {
          height: 1px;
          flex: 1;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,139,89,.55)
            );
        }

        .intro-divider span:last-child {
          background:
            linear-gradient(
              90deg,
              rgba(255,139,89,.55),
              transparent
            );
        }

        .intro-divider b {
          color: #ff8a4c;
          font-size: 13px;
          font-weight: 400;
          animation:
            symbolPulse 2.5s ease-in-out infinite;
        }

        @keyframes symbolPulse {
          0%,100% {
            transform: scale(.85);
            opacity: .5;
          }

          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .intro-subtitle {
          color: rgba(255,235,224,.65);
          font-size: 14px;
          line-height: 1.9;
          letter-spacing: .04em;
          margin: 0;
        }

        .intro-enter {
          position: relative;
          width: 155px;
          height: 155px;
          margin-top: 45px;
          border-radius: 50%;
          border: 1px solid rgba(255,134,82,.45);
          background:
            radial-gradient(
              circle,
              rgba(255,104,44,.1),
              rgba(255,50,10,.025) 55%,
              transparent 70%
            );
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            transform .45s ease,
            border-color .45s ease,
            box-shadow .45s ease;
          box-shadow:
            0 0 35px rgba(255,70,20,.08);
        }

        .intro-enter:hover {
          transform: scale(1.08);
          border-color:
            rgba(255,176,130,.8);
          box-shadow:
            0 0 55px rgba(255,65,20,.25),
            inset 0 0 35px rgba(255,65,20,.1);
        }

        .enter-ring {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border:
            1px solid rgba(255,104,52,.18);
          animation:
            enterRing 3s ease-in-out infinite;
        }

        @keyframes enterRing {
          0%,100% {
            transform: scale(.9);
            opacity: .25;
          }

          50% {
            transform: scale(1.12);
            opacity: .7;
          }
        }

        .enter-label {
          display: flex;
          flex-direction: column;
          gap: 7px;
          letter-spacing: .15em;
        }

        .enter-label small {
          font-size: 8px;
          color: rgba(255,221,207,.5);
          letter-spacing: .28em;
        }

        .enter-label strong {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .18em;
        }

        .enter-arrow {
          position: absolute;
          bottom: 17px;
          font-size: 14px;
          color: #ff9b70;
          animation:
            arrowDown 1.8s ease-in-out infinite;
        }

        @keyframes arrowDown {
          0%,100% {
            transform: translateY(0);
            opacity: .5;
          }

          50% {
            transform: translateY(4px);
            opacity: 1;
          }
        }

        .intro-footnote {
          margin-top: 28px;
          font-size: 9px;
          line-height: 1.7;
          letter-spacing: .15em;
          text-transform: uppercase;
          color: rgba(255,220,204,.3);
        }

        .intro-bottom {
          position: absolute;
          left: 35px;
          right: 35px;
          bottom: 25px;
          display: flex;
          justify-content: space-between;
          color: rgba(255,215,199,.28);
          font-size: 8px;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        /* =====================================================
           CANVAS
        ===================================================== */

        .world-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .world-canvas canvas {
          width: 100% !important;
          height: 100% !important;
        }

        .floating-embers {
          position: fixed;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          overflow: hidden;
        }

        .ember {
          position: absolute;
          bottom: -10px;
          border-radius: 50%;
          background: #ff7a3d;
          box-shadow:
            0 0 8px #ff4b19,
            0 0 18px rgba(255,75,25,.55);
          animation:
            emberRise
            linear
            infinite;
        }

        @keyframes emberRise {
          0% {
            transform:
              translate3d(0,30px,0)
              scale(.4);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          70% {
            opacity: .65;
          }

          100% {
            transform:
              translate3d(
                var(--drift),
                -110vh,
                0
              )
              scale(1);
            opacity: 0;
          }
        }

        .sound-button {
          position: fixed;
          right: 24px;
          top: 24px;
          z-index: 20;
          border:
            1px solid rgba(255,255,255,.14);
          background:
            rgba(5,3,8,.42);
          backdrop-filter: blur(15px);
          color: rgba(255,240,232,.75);
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 10px;
          letter-spacing: .14em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .sound-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #777;
          margin-right: 7px;
        }

        .sound-dot.active {
          background: #ff6b32;
          box-shadow:
            0 0 9px #ff4b1a;
        }

        #experience-scroll {
          position: relative;
          z-index: 4;
        }

        .scene {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
        }

        /* =====================================================
           HERO
        ===================================================== */

        .hero-scene {
          padding:
            12vh
            clamp(25px, 8vw, 120px);
          min-height: 120vh;
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse at 50% 50%,
              transparent 15%,
              rgba(3,1,7,.2) 50%,
              rgba(3,1,7,.88) 100%
            );
          pointer-events: none;
        }

        .hero-copy {
          position: relative;
          z-index: 2;
          max-width: 620px;
        }

        .eyebrow,
        .mini-eyebrow {
          margin: 0 0 20px;
          color: #ff9169;
          font-size: 10px;
          letter-spacing: .42em;
          text-transform: uppercase;
        }

        .hero-copy h1 {
          margin: 0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(55px, 9vw, 120px);
          line-height: .9;
          font-weight: 400;
          letter-spacing: -.045em;
          color: #fff5ef;
        }

        .hero-copy h1 em {
          color: #ff966f;
          font-weight: 400;
          text-shadow:
            0 0 50px rgba(255,68,20,.35);
        }

        .hero-description {
          max-width: 390px;
          margin-top: 32px;
          color: rgba(255,235,224,.62);
          font-size: 15px;
          line-height: 1.9;
        }

        .hero-line {
          width: 75px;
          height: 1px;
          margin: 35px 0 22px;
          background:
            linear-gradient(
              90deg,
              #ff6a32,
              transparent
            );
        }

        .scroll-note {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,221,207,.4);
          font-size: 9px;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        .scroll-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ff7138;
          box-shadow:
            0 0 10px #ff4b1a;
        }

        .hero-side-note {
          position: absolute;
          right: 40px;
          bottom: 50px;
          display: flex;
          flex-direction: column;
          gap: 9px;
          color: rgba(255,224,211,.3);
          font-size: 8px;
          letter-spacing: .25em;
          writing-mode: vertical-rl;
        }

        /* =====================================================
           BEGINNING
        ===================================================== */

        .reveal-scene {
          justify-content: flex-end;
          padding:
            15vh
            clamp(25px, 10vw, 160px);
          background:
            linear-gradient(
              90deg,
              rgba(3,1,7,0),
              rgba(3,1,7,.25)
            );
        }

        .scene-label {
          position: absolute;
          left: clamp(25px, 6vw, 80px);
          top: 15vh;
          display: flex;
          gap: 15px;
          align-items: center;
          color: rgba(255,222,207,.35);
        }

        .scene-label span {
          color: #ff7741;
          font-size: 10px;
          letter-spacing: .15em;
        }

        .scene-label p {
          margin: 0;
          font-size: 8px;
          letter-spacing: .35em;
        }

        .reveal-copy {
          width: min(610px, 90vw);
          margin-right: 5vw;
        }

        .reveal-copy h2,
        .closeness-copy h2,
        .brother-copy h2,
        .fear-copy h2,
        .gratitude-copy h2,
        .hard-times-copy h2 {
          margin: 0 0 35px;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(45px, 6vw, 82px);
          line-height: .96;
          font-weight: 400;
          letter-spacing: -.04em;
        }

        .reveal-copy h2 em,
        .closeness-copy h2 em,
        .brother-copy h2 em,
        .fear-copy h2 em,
        .gratitude-copy h2 em,
        .hard-times-copy h2 em {
          color: #ff936b;
          font-style: italic;
        }

        .reveal-copy > p:not(.mini-eyebrow),
        .closeness-copy > p,
        .brother-copy > p,
        .fear-copy > p,
        .gratitude-copy > p,
        .hard-times-copy > p {
          max-width: 550px;
          color: rgba(255,235,226,.63);
          font-size: 15px;
          line-height: 2;
          margin: 0 0 24px;
        }

        .reveal-copy p span {
          color: #ffad8b;
          font-family:
            Georgia,
            serif;
          font-style: italic;
        }

        .quiet-line {
          color: rgba(255,205,185,.4) !important;
          font-style: italic;
        }

        .closing-thought {
          margin-top: 50px !important;
          color: rgba(255,238,230,.8) !important;
        }

        .closing-thought strong {
          color: #ff9a72;
          font-family: Georgia, serif;
          font-weight: 400;
        }

        .memory-pulse {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 40px 0;
        }

        .memory-pulse span {
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ff7138;
          box-shadow:
            0 0 10px #ff4c19;
          animation:
            pulseDot 1.8s ease-in-out infinite;
        }

        .memory-pulse span:nth-child(2) {
          animation-delay: .25s;
        }

        .memory-pulse span:nth-child(3) {
          animation-delay: .5s;
        }

        @keyframes pulseDot {
          0%,100% {
            transform: scale(.5);
            opacity: .3;
          }

          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        /* =====================================================
           MEMORIES
        ===================================================== */

        .memories-scene {
          display: block;
          padding:
            15vh
            clamp(25px, 8vw, 120px);
          min-height: 180vh;
        }

        .section-heading {
          position: relative;
          z-index: 2;
          max-width: 680px;
          margin-bottom: 100px;
        }

        .section-heading h2 {
          margin: 0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-weight: 400;
          font-size:
            clamp(44px, 6vw, 82px);
          line-height: .98;
          letter-spacing: -.04em;
        }

        .section-heading h2 em {
          color: #ff936b;
          font-style: italic;
        }

        .section-heading > p:last-child {
          margin-top: 30px;
          max-width: 430px;
          color: rgba(255,230,218,.45);
          font-size: 13px;
          line-height: 1.8;
        }

        .memory-stack {
          position: relative;
          max-width: 1050px;
          margin: 0 auto;
          padding-bottom: 80px;
        }

        .memory-card {
          position: relative;
          width: min(680px, 78vw);
          margin-bottom: 120px;
          display: flex;
          flex-direction: column;
        }

        .memory-card:nth-child(even) {
          margin-left: auto;
        }

        .memory-card:nth-child(odd) {
          margin-left: 3vw;
        }

        .memory-image {
          position: relative;
          aspect-ratio: 1.18 / 1;
          overflow: hidden;
          border:
            1px solid rgba(255,158,124,.16);
          background:
            linear-gradient(
              135deg,
              rgba(255,70,25,.07),
              rgba(255,255,255,.025)
            );
          box-shadow:
            0 30px 100px rgba(0,0,0,.45),
            0 0 70px rgba(255,62,18,.06);
        }

        .memory-card:nth-child(2)
          .memory-image {
          aspect-ratio: 1.4 / 1;
        }

        .memory-card:nth-child(3)
          .memory-image {
          aspect-ratio: 1 / 1.12;
        }

        .memory-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              130deg,
              transparent 45%,
              rgba(255,110,67,.1),
              transparent 58%
            );
          transform:
            translateX(-120%);
          transition:
            transform 1s ease;
        }

        .memory-card.is-active
          .memory-image::after {
          transform:
            translateX(120%);
        }

        .memory-image img {
          position: absolute;
          inset: -8%;
          width: 116%;
          height: 116%;
          object-fit: cover;
          filter:
            saturate(.82)
            contrast(1.05);
          transition:
            filter .7s ease,
            transform 1s ease;
        }

        .memory-card:hover
          .memory-image img {
          filter:
            saturate(1)
            contrast(1.08);
        }

        .memory-glow {
          position: absolute;
          z-index: 1;
          width: 50%;
          height: 50%;
          left: 25%;
          top: 25%;
          border-radius: 50%;
          background:
            rgba(255,65,20,.22);
          filter: blur(80px);
          pointer-events: none;
          opacity: .35;
        }

        .photo-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: rgba(255,219,204,.32);
          letter-spacing: .3em;
          background:
            radial-gradient(
              circle,
              rgba(255,83,35,.08),
              transparent 60%
            );
          z-index: 0;
        }

        .photo-placeholder span {
          font-size: 10px;
        }

        .photo-placeholder small {
          margin-top: 10px;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .photo-number {
          position: absolute;
          right: 20px;
          top: 18px;
          z-index: 3;
          font-family:
            Georgia,
            serif;
          font-size: 14px;
          color: rgba(255,230,220,.5);
        }

        .memory-caption {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 18px;
          padding: 22px 5px;
        }

        .memory-caption > span {
          color: #ff814d;
          font-size: 8px;
          letter-spacing: .28em;
        }

        .memory-caption p {
          margin: 0;
          color: rgba(255,238,229,.8);
          font-family:
            Georgia,
            serif;
          font-size: 19px;
          line-height: 1.5;
        }

        .memory-caption small {
          grid-column: 2;
          color: rgba(255,220,205,.4);
          font-size: 11px;
          line-height: 1.8;
        }

        /* =====================================================
           CLOSENESS
        ===================================================== */

        .closeness-scene {
          justify-content: center;
          padding: 15vh 25px;
        }

        .closeness-copy {
          width: min(760px, 90vw);
        }

        .quote-card {
          position: relative;
          margin: 55px 0;
          padding: 35px 45px;
          border:
            1px solid rgba(255,132,91,.15);
          background:
            rgba(255,67,23,.035);
          box-shadow:
            inset 0 0 70px rgba(255,64,20,.025);
        }

        .quote-card > span {
          position: absolute;
          left: 18px;
          top: 10px;
          font-family:
            Georgia,
            serif;
          font-size: 55px;
          color: rgba(255,115,69,.4);
        }

        .quote-card p {
          margin: 0;
          color: rgba(255,235,225,.72);
          font-family:
            Georgia,
            serif;
          font-style: italic;
          font-size: 20px;
          line-height: 1.7;
        }

        .quote-end {
          left: auto !important;
          right: 18px;
          top: auto !important;
          bottom: -20px;
        }

        .forever-line {
          margin-top: 50px !important;
          font-family:
            Georgia,
            serif;
          font-size: 22px !important;
          color: rgba(255,235,225,.8) !important;
        }

        .forever-line strong {
          color: #ff956e;
          font-weight: 400;
        }

        /* =====================================================
           HABITS
        ===================================================== */

        .habits-scene {
          justify-content: center;
          padding: 15vh 25px;
        }

        .habits-card {
          width: min(900px, 90vw);
          padding:
            clamp(35px, 6vw, 75px);
          border:
            1px solid rgba(255,141,100,.13);
          background:
            linear-gradient(
              145deg,
              rgba(255,90,40,.05),
              rgba(255,255,255,.015)
            );
          backdrop-filter: blur(10px);
          box-shadow:
            0 50px 120px rgba(0,0,0,.3);
        }

        .habits-top {
          display: flex;
          justify-content: space-between;
          color: rgba(255,216,199,.35);
          font-size: 8px;
          letter-spacing: .3em;
          margin-bottom: 60px;
        }

        .habits-card h2 {
          margin: 0 0 65px;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(45px, 6vw, 78px);
          font-weight: 400;
          line-height: .95;
        }

        .habit-row {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 20px;
          padding: 25px 0;
          border-top:
            1px solid rgba(255,255,255,.08);
        }

        .habit-row > span {
          color: #ff7541;
          font-size: 9px;
          letter-spacing: .2em;
        }

        .habit-row p {
          margin: 0;
          max-width: 570px;
          color: rgba(255,230,220,.58);
          line-height: 1.8;
          font-size: 14px;
        }

        .habit-footer {
          margin-top: 60px;
          color: rgba(255,150,110,.75);
          font-family:
            Georgia,
            serif;
          font-size: 20px;
          line-height: 1.6;
        }

        /* =====================================================
           TIMELINE
        ===================================================== */

        .timeline-scene {
          display: block;
          padding:
            15vh
            clamp(25px, 10vw, 150px);
          min-height: 170vh;
        }

        .timeline-heading {
          margin-bottom: 100px;
        }

        .timeline {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }

        .timeline-line {
          position: absolute;
          left: 25px;
          top: 0;
          bottom: 0;
          width: 1px;
          background:
            linear-gradient(
              180deg,
              transparent,
              rgba(255,91,38,.55),
              rgba(255,91,38,.15),
              transparent
            );
        }

        .timeline-line span {
          position: sticky;
          top: 50%;
          display: block;
          width: 8px;
          height: 8px;
          margin-left: -3.5px;
          border-radius: 50%;
          background: #ff6b32;
          box-shadow:
            0 0 20px #ff4216;
        }

        .timeline-item {
          position: relative;
          display: grid;
          grid-template-columns: 70px 1fr;
          gap: 40px;
          padding: 70px 0;
        }

        .timeline-marker {
          position: relative;
          z-index: 2;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border:
            1px solid rgba(255,113,65,.28);
          background: #08040b;
          color: #ff8657;
          font-size: 10px;
          letter-spacing: .1em;
          box-shadow:
            0 0 25px rgba(255,65,20,.08);
        }

        .phoenix-marker {
          color: #fff1e7;
          background:
            radial-gradient(
              circle,
              rgba(255,82,27,.3),
              #08040b 65%
            );
        }

        .timeline-item small {
          color: #ff7d48;
          font-size: 8px;
          letter-spacing: .3em;
        }

        .timeline-item h3 {
          margin:
            13px 0 18px;
          max-width: 500px;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(25px, 3vw, 42px);
          font-weight: 400;
          line-height: 1.08;
        }

        .timeline-item p {
          margin: 0;
          max-width: 480px;
          color: rgba(255,225,212,.46);
          line-height: 1.8;
          font-size: 13px;
        }

        /* =====================================================
           HARD TIMES
        ===================================================== */

        .hard-times-scene {
          justify-content: center;
          min-height: 150vh;
          padding:
            15vh 25px;
        }

        .hard-times-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 50% 45%,
              rgba(130,26,8,.2),
              transparent 35%
            ),
            linear-gradient(
              180deg,
              transparent,
              rgba(2,1,5,.72)
            );
        }

        .hard-times-copy {
          position: relative;
          z-index: 2;
          width: min(720px, 90vw);
        }

        .hard-times-copy h2 {
          margin-bottom: 50px;
        }

        .strong-memory {
          color:
            rgba(255,225,212,.82) !important;
          font-family:
            Georgia,
            serif;
          font-size: 19px !important;
        }

        .hard-divider {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 50px 0;
        }

        .hard-divider span {
          width: 55px;
          height: 1px;
          background:
            rgba(255,100,52,.35);
        }

        .hard-divider b {
          color: #ff6630;
          font-weight: 400;
        }

        .accident-memory {
          color: #ffb096 !important;
        }

        .hard-times-copy blockquote {
          margin:
            45px 0;
          padding-left: 25px;
          border-left:
            1px solid rgba(255,92,44,.5);
          color: #ff9d78;
          font-family:
            Georgia,
            serif;
          font-style: italic;
          font-size:
            clamp(24px, 3vw, 38px);
          line-height: 1.25;
        }

        .regret {
          color: rgba(255,155,125,.45) !important;
          font-style: italic;
        }

        /* =====================================================
           GRATITUDE
        ===================================================== */

        .gratitude-scene {
          justify-content: center;
          padding: 15vh 25px;
          overflow: hidden;
        }

        .gratitude-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 700px;
          height: 700px;
          transform:
            translate(-50%,-50%);
          border:
            1px solid rgba(255,89,38,.08);
          border-radius: 50%;
        }

        .gratitude-orbit::before,
        .gratitude-orbit::after {
          content: "";
          position: absolute;
          inset: 90px;
          border:
            1px solid rgba(255,89,38,.06);
          border-radius: 50%;
        }

        .gratitude-orbit::after {
          inset: 180px;
        }

        .gratitude-copy {
          position: relative;
          z-index: 2;
          width: min(780px, 90vw);
          text-align: center;
        }

        .gratitude-copy h2 {
          margin-bottom: 45px;
        }

        .gratitude-copy p {
          margin-left: auto;
          margin-right: auto;
        }

        .gratitude-final {
          margin-top: 60px;
          color: rgba(255,222,208,.55);
          font-family:
            Georgia,
            serif;
          font-size: 18px;
          line-height: 1.7;
        }

        .gratitude-final strong {
          display: block;
          color: #ff9b75;
          font-size: 28px;
          font-weight: 400;
          margin-top: 5px;
        }

        /* =====================================================
           BROTHER
        ===================================================== */

        .brother-scene {
          justify-content: flex-start;
          padding:
            15vh
            clamp(25px, 13vw, 190px);
        }

        .brother-copy {
          width: min(650px, 90vw);
        }

        .free-line {
          margin-top: 50px !important;
          color: rgba(255,237,228,.82) !important;
          font-family:
            Georgia,
            serif;
          font-size: 20px !important;
        }

        .free-line::first-line {
          color: #ff9b74;
        }

        /* =====================================================
           FEAR
        ===================================================== */

        .fear-scene {
          justify-content: center;
          min-height: 140vh;
          padding: 15vh 25px;
          background:
            radial-gradient(
              ellipse at center,
              rgba(69,10,10,.16),
              transparent 50%
            );
        }

        .fear-copy {
          width: min(720px, 90vw);
        }

        .fear-strong {
          color: rgba(255,222,211,.8) !important;
          font-family:
            Georgia,
            serif;
          font-size: 20px !important;
        }

        .fear-visual {
          display: flex;
          align-items: center;
          gap: 25px;
          margin: 60px 0;
          color: rgba(255,195,175,.3);
          font-size: 9px;
          letter-spacing: .2em;
        }

        .fear-visual i {
          flex: 1;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,83,39,.5),
              transparent
            );
          position: relative;
        }

        .fear-visual i::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 7px;
          height: 7px;
          transform:
            translate(-50%,-50%);
          border-radius: 50%;
          background: #ff5a24;
          box-shadow:
            0 0 18px #ff3e13;
        }

        /* =====================================================
           LETTER
        ===================================================== */

        .letter-section {
          justify-content: center;
          padding:
            18vh
            clamp(18px, 5vw, 80px);
          min-height: 190vh;
        }

        .letter-atmosphere {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse at 50% 25%,
              rgba(255,81,29,.14),
              transparent 30%
            ),
            radial-gradient(
              ellipse at 50% 70%,
              rgba(255,50,15,.07),
              transparent 45%
            );
        }

        .letter-panel {
          position: relative;
          width: min(820px, 92vw);
          padding:
            clamp(35px, 7vw, 90px);
          background:
            linear-gradient(
              145deg,
              rgba(19,9,13,.86),
              rgba(9,4,10,.94)
            );
          border:
            1px solid rgba(255,148,111,.16);
          box-shadow:
            0 60px 140px rgba(0,0,0,.45),
            inset 0 0 100px rgba(255,61,18,.025);
          backdrop-filter: blur(15px);
        }

        .letter-panel::before {
          content: "";
          position: absolute;
          inset: 12px;
          border:
            1px solid rgba(255,255,255,.035);
          pointer-events: none;
        }

        .letter-top {
          display: flex;
          justify-content: space-between;
          padding-bottom: 25px;
          margin-bottom: 65px;
          border-bottom:
            1px solid rgba(255,255,255,.08);
          color: rgba(255,218,203,.3);
          font-size: 8px;
          letter-spacing: .3em;
        }

        .letter-copy {
          position: relative;
          z-index: 2;
        }

        .letter-copy h2 {
          margin: 0 0 55px;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(65px, 10vw, 120px);
          font-weight: 400;
          font-style: italic;
          color: #ff9a73;
          line-height: .8;
        }

        .letter-paragraph {
          max-width: 640px;
          margin:
            0 0 32px;
          color: rgba(255,235,226,.67);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(17px, 2vw, 20px);
          line-height: 1.95;
        }

        .letter-paragraph strong {
          color: #ffb094;
          font-weight: 400;
        }

        .letter-break {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 60px 0;
        }

        .letter-break span {
          width: 60px;
          height: 1px;
          background:
            rgba(255,100,57,.3);
        }

        .letter-break b {
          color: #ff6934;
          font-weight: 400;
        }

        .apology {
          color: rgba(255,225,214,.85);
        }

        .huge-message {
          font-size:
            clamp(30px, 5vw, 58px) !important;
          line-height: 1.05 !important;
          margin-top: 45px !important;
        }

        .final-letter {
          margin-top: 60px;
          padding-top: 40px;
          border-top:
            1px solid rgba(255,255,255,.08);
        }

        .signature-block {
          margin-top: 75px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .signature-block span {
          color: rgba(255,218,204,.35);
          font-size: 10px;
          letter-spacing: .2em;
        }

        .signature-block strong {
          font-family:
            Georgia,
            serif;
          font-size: 30px;
          font-style: italic;
          color: #ff9b73;
        }

        /* =====================================================
           ENDING
        ===================================================== */

        .ending-scene {
          min-height: 130vh;
          justify-content: center;
          text-align: center;
          padding: 15vh 25px;
          overflow: hidden;
        }

        .ending-stars {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at center,
              rgba(255,78,26,.14),
              transparent 18%
            );
        }

        .ending-stars::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(
              circle,
              rgba(255,255,255,.65) 0 1px,
              transparent 1.5px
            );
          background-size:
            90px 90px;
          mask-image:
            radial-gradient(
              circle,
              black,
              transparent 70%
            );
          opacity: .35;
        }

        .ending-copy {
          position: relative;
          z-index: 2;
          width: min(720px, 90vw);
        }

        .ending-copy h2 {
          margin: 0 0 45px;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(60px, 9vw, 110px);
          font-weight: 400;
          line-height: .88;
          letter-spacing: -.05em;
        }

        .ending-copy h2 em {
          color: #ff976e;
          font-style: italic;
        }

        .ending-copy > p {
          max-width: 520px;
          margin:
            0 auto 24px;
          color: rgba(255,230,219,.58);
          font-family:
            Georgia,
            serif;
          font-size: 17px;
          line-height: 1.9;
        }

        .ending-phoenix-word {
          margin:
            100px auto 30px;
          color: rgba(255,116,68,.75);
          font-size:
            clamp(35px, 7vw, 80px);
          font-weight: 200;
          letter-spacing: .18em;
          text-indent: .18em;
          text-shadow:
            0 0 50px rgba(255,61,17,.35);
        }

        .ending-symbol {
          margin: 25px auto 45px;
          color: #ff7540;
          font-size: 20px;
          animation:
            symbolPulse 2.8s ease-in-out infinite;
        }

        .ending-final {
          color:
            rgba(255,220,207,.42) !important;
        }

        .ending-final.strong {
          color:
            rgba(255,158,122,.75) !important;
          font-size: 20px !important;
        }

        .ending-copy small {
          display: block;
          margin-top: 80px;
          color: rgba(255,210,194,.25);
          font-size: 8px;
          letter-spacing: .3em;
          line-height: 2;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 700px) {
          .intro-bottom {
            left: 18px;
            right: 18px;
            bottom: 18px;
          }

          .intro-bottom span:nth-child(2) {
            display: none;
          }

          .intro-title-line {
            font-size:
              clamp(36px, 11vw, 60px);
          }

          .intro-portal {
            width: 130px;
            height: 130px;
          }

          .orbit-one {
            width: 280px;
            height: 120px;
          }

          .orbit-two {
            width: 390px;
            height: 160px;
          }

          .orbit-three {
            width: 500px;
            height: 220px;
          }

          .hero-scene {
            padding:
              15vh 25px;
            align-items: flex-end;
          }

          .hero-copy {
            padding-bottom: 15vh;
          }

          .hero-side-note {
            right: 16px;
            bottom: 25px;
          }

          .reveal-scene {
            justify-content: center;
            padding:
              15vh 25px;
          }

          .scene-label {
            top: 9vh;
            left: 25px;
          }

          .memories-scene {
            padding:
              15vh 20px;
          }

          .memory-card,
          .memory-card:nth-child(odd),
          .memory-card:nth-child(even) {
            width: 92vw;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 80px;
          }

          .memory-caption {
            grid-template-columns: 80px 1fr;
            gap: 10px;
          }

          .memory-caption p {
            font-size: 16px;
          }

          .memory-caption small {
            grid-column: 1 / -1;
            padding-left: 90px;
          }

          .habits-card {
            padding: 30px 24px;
          }

          .habit-row {
            grid-template-columns: 40px 1fr;
          }

          .timeline-scene {
            padding:
              15vh 22px;
          }

          .timeline-item {
            grid-template-columns: 50px 1fr;
            gap: 20px;
          }

          .timeline-line {
            left: 25px;
          }

          .timeline-marker {
            width: 42px;
            height: 42px;
          }

          .letter-section {
            padding:
              15vh 12px;
          }

          .letter-panel {
            padding:
              35px 24px;
          }

          .letter-panel::before {
            inset: 7px;
          }

          .letter-top {
            margin-bottom: 45px;
          }

          .ending-scene {
            min-height: 120vh;
          }

          .sound-button {
            right: 14px;
            top: 14px;
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  )
}

/* =========================================================
   GLTF PRELOAD
========================================================= */

useGLTF.preload(
  PHOENIX_PATH,
)

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default AbiExperience