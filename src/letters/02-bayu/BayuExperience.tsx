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

/* =========================================================
   DRAGON ASSET
========================================================= */

const DRAGON_PATH =
  `${import.meta.env.BASE_URL}assets/02-bayu/dragon/dragon.glb`

/* =========================================================
   EASY ASSET CONFIG
   CUKUP GANTI NAMA FILE DI SINI.
   Semua file berada di public/assets/02-bayu/
========================================================= */

const MUSIC_FILE =
  'bayu-memory.mp3'

const PHOTO_FILES = {
  memory01: 'bayu.jpeg',
  memory02: 'memory-02.jpeg',
  memory03: 'memory-03.jpeg',
  memory04: 'memory-04.jpeg',
  memory05: 'memory-05.jpeg',
  memory06: 'memory-06.jpeg',
  memory07: 'memory-07.jpeg',
  memory08: 'memory-08.jpeg',
  memory09: 'memory-09.jpeg',
  memory10: 'memory-10.jpeg',
  memory11: 'memory-11.jpeg',
  memory12: 'memory-12.jpeg',
  memory13: 'memory-13.jpeg',
  memory14: 'memory-14.jpeg',
  memory15: 'memory-15.jpeg',
  memory16: 'memory-16.jpeg',
  memory17: 'memory-17.jpeg',
  memory18: 'memory-18.jpeg',
  memory19: 'memory-19.jpeg',
  memory20: 'memory-20.jpeg',
  memory21: 'memory-21.jpeg',
  memory22: 'memory-22.jpeg',
  bracelet: 'gelang.jpeg',
}

const MUSIC_PATH =
  `${import.meta.env.BASE_URL}assets/02-bayu/audio/${MUSIC_FILE}`

const PHOTO_PATH = (
  file: string,
) =>
  `${import.meta.env.BASE_URL}assets/02-bayu/photos/${file}`

/* =========================================================
   PHOTOS
========================================================= */

const memories = [
  { image: PHOTO_PATH(PHOTO_FILES.memory01), label: 'MEMORY 01' },
  { image: PHOTO_PATH(PHOTO_FILES.memory02), label: 'MEMORY 02' },
  { image: PHOTO_PATH(PHOTO_FILES.memory03), label: 'MEMORY 03' },
  { image: PHOTO_PATH(PHOTO_FILES.memory04), label: 'MEMORY 04' },
  { image: PHOTO_PATH(PHOTO_FILES.memory05), label: 'MEMORY 05' },
  { image: PHOTO_PATH(PHOTO_FILES.memory06), label: 'MEMORY 06' },
  { image: PHOTO_PATH(PHOTO_FILES.memory07), label: 'MEMORY 07' },
  { image: PHOTO_PATH(PHOTO_FILES.memory08), label: 'MEMORY 08' },
  { image: PHOTO_PATH(PHOTO_FILES.memory09), label: 'MEMORY 09' },
  { image: PHOTO_PATH(PHOTO_FILES.memory10), label: 'MEMORY 10' },
  { image: PHOTO_PATH(PHOTO_FILES.memory11), label: 'MEMORY 11' },
  { image: PHOTO_PATH(PHOTO_FILES.memory12), label: 'MEMORY 12' },
  { image: PHOTO_PATH(PHOTO_FILES.memory13), label: 'MEMORY 13' },
  { image: PHOTO_PATH(PHOTO_FILES.memory14), label: 'MEMORY 14' },
  { image: PHOTO_PATH(PHOTO_FILES.memory15), label: 'MEMORY 15' },
  { image: PHOTO_PATH(PHOTO_FILES.memory16), label: 'MEMORY 16' },
  { image: PHOTO_PATH(PHOTO_FILES.memory17), label: 'MEMORY 17' },
  { image: PHOTO_PATH(PHOTO_FILES.memory18), label: 'MEMORY 18' },
  { image: PHOTO_PATH(PHOTO_FILES.memory19), label: 'MEMORY 19' },
  { image: PHOTO_PATH(PHOTO_FILES.memory20), label: 'MEMORY 20' },
  { image: PHOTO_PATH(PHOTO_FILES.memory21), label: 'MEMORY 21' },
  { image: PHOTO_PATH(PHOTO_FILES.memory22), label: 'MEMORY 22' },
]

/* =========================================================
   BOOK PAGES
========================================================= */

const pages = [
  {
    number: '01',
    label: 'THE BEGINNING',
    title: 'Where it all started.',
  },

  {
    number: '02',
    label: 'WHO YOU ARE',
    title: 'More than I expected.',
  },

  {
    number: '03',
    label: 'THE LITTLE THINGS',
    title: 'The things I will remember.',
  },

  {
    number: '04',
    label: 'THE JOURNEY',
    title: 'We made it this far.',
  },

  {
    number: '05',
    label: 'WHAT YOU MEAN',
    title: 'More than a friend.',
  },

  {
    number: '06',
    label: 'THE FEAR',
    title: 'Some distances are scary.',
  },

  {
    number: '07',
    label: 'THE MESSAGE',
    title: 'For wherever life takes you.',
  },

  {
    number: '08',
    label: 'UNTIL AGAIN',
    title: 'This is not the end.',
  },
]

/* =========================================================
   TEXT
   KEEP EXACTLY AS PROVIDED
========================================================= */

const letterText = {
  identity: `Berchmans Bayu bin Jaya / Bayu`,

  beginning: `Kita dulu kenal di hari pertama kita masuk. Saat itu aku lupa mata kuliah apa, tapi kamu duduk di belakangku bareng Diego. Kalian kelihatan akrab banget, sampai Diego ngajak aku ngobrol dan akhirnya aku kenalan juga sama kamu. Setelah itu, kita mulai akrab. Kamu bahkan sempat ngajak aku main ke kosmu waktu itu.`,

  firstImpression: `Awalnya kamu kelihatan kayak introvert. Tapi makin ke sini, aku mulai melihat dirimu yang sebenarnya. Bukan cuma prasangka bahwa kamu orang yang kelihatannya baik, tapi ternyata kamu memang benar-benar orang yang baik. Bisa dibilang kamu setia dan tulus sih, wkwk. Aku juga nggak pernah nyangka bisa temenan sama kamu, apalagi awalnya kamu sama Diego malah mengira aku Katolik, wkwk. Itu kocak sih.`,

  friendship: `Nggak tahu memang sudah takdir atau bagaimana. Bukannya makin menjauh, ternyata kita justru bisa dibilang berteman cukup awet, bahkan dari semester 1 sampai sekarang, dan semoga sampai selamanya. Nggak nyangka aja, dengan waktu yang cukup lama ini, aku bisa dekat sama kamu. Itu bahkan nggak pernah ada di pikiranku sebelumnya. Itu salah satu hal yang aku syukuri selama kuliah di sini: bisa ketemu orang seperti kamu.`,

  habits: `Sebenarnya kamu punya kebiasaan unik waktu awal-awal dulu yang nggak pernah aku ekspektasikan. Kamu makan nasi pakai Energen, kadang pakai kue kacang. Jujur, aku shock, wkwkwk. Selain itu, ada kepribadianmu yang selalu ada dalam dirimu: kamu cukup tenang untuk memahami situasi. Meski kamu merasa berat, kamu nggak selalu menunjukkannya, dan aku tahu ada rasa khawatir yang kamu simpan. Kamu juga sangat bisa diandalkan. Orang-orang yang ada di sekitarmu, aku yakin, akan merasakan hal yang sama. Kamu peduli.`,

  random: `Hal random yang selalu kamu lakukan, ya celetukanmu. Mungkin itu yang nanti paling aku kangenin. Tiba-tiba banget bisa bahas apa pun yang unik dan nggak disangka. Kadang kamu diam aja, tapi selalu ada gebrakanmu, wkwk. Kadang demi cari cewek, hampir semuanya dicobain, dibabat njir, wkwkwk. Tapi salutnya, serandom apa pun kelakuanmu, kamu masih tetap berjalan di jalan yang benar.`,

  impressed: `Aku terkesan banget sama kamu saat kamu bertanggung jawab atas sesuatu, termasuk cara kamu menangani orang-orang di sekitarmu tanpa terbawa emosi berlebihan. Cara kamu memperhatikan orang-orang di sekitarmu juga kelihatan banget. The best.`,

  difficultTimes: `Dari semua yang terjadi, kamu mampu menjalani masalah apa pun, termasuk skripsi yang lumayan berat dan menantang, yang akhirnya berhasil kita taklukkan. Mungkin setelah ini kita harus berjuang lagi menghadapi masalah nyata di hidup kita. Tapi aku yakin kamu bisa melewatinya. Seberat apa pun itu, jangan ragu untuk menghubungiku. Entah sekadar mengobrol, curhat, atau berbagi kisah apa pun, akan kutunggu dan akan selalu ada waktu untukmu.`,

  whatHeKnows: `Apa yang kamu tahu tentangku, aku juga nggak tahu. Aku saja kadang nggak mengerti dengan diriku sendiri. Tapi apa pun itu, semoga kepribadianku tidak merepotkanmu. Kalau ternyata merepotkan, sungguh aku minta maaf sebanyak apa pun itu.`,

  gratitude: `Jujur, aku bersyukur bisa kenal dan dekat denganmu. Aku punya sosok yang bisa kuajak berbagi cerita, keluh kesah, senang-senang bareng, berbagi pandangan, dan saling menasihati. Itu hal yang jarang bisa kudapatkan, apalagi dengan traumaku saat pernah punya hubungan dengan teman. Aku bisa membuka diri kepada orang lain itu juga berkat kamu dan Abi. Terima kasih banyak.`,

  family: `Mungkin awalnya aku hanya menganggapmu sebagai teman biasa, atau mungkin hanya kenalan. Tapi beberapa waktu lalu hingga kini dan nanti, kamu bukan hanya teman. Kamu sudah lebih dari sahabat, bahkan sebagai keluarga yang penting bagiku.`,

  fear: `Jujur saja, aku sebenarnya juga agak takut saat terjadi perselisihan di antara kita. Bukan karena apa-apa, tapi karena kepribadianku dan trauma dengan teman bisa membuatku meng-cut off orang untuk selamanya. Cuma untuk kamu dan Abi, itu berbeda. Sebenarnya aku juga kalau kalian menghilang atau ada jarak di antara kita... asekk, wkwkwk. Maksudku, bisa dibilang kita jarang banget berantem. Jadi kadang ada kalanya aku kesal karena sesuatu, tapi ternyata itu bukan alasan buat kita berjarak. Malah, itu jadi jembatan untuk kita lebih saling percaya.`,

  messageIntro: `Bayu, pesan buat kamu: apa pun yang terjadi setelah ini, di mana pun kamu berada, dengan siapa pun itu, jangan lupakan aku. Jangan ragu untuk menghubungiku kapan pun itu. Jujur saja, aku selalu bertanya: apakah ini benar-benar akhirnya? Atau mungkin akan ada waktu yang membuat kita berkumpul lagi? Kapan kita bisa bertemu lagi?`,

  messageDreams: `Kamu punya mimpi besar dan kamu juga punya skill. Jangan ragu dengan kemampuan yang sudah kamu punya. Jangan pula meremehkan hal sekecil apa pun. Hal kecil bisa memetik efek jangka panjang. Jadilah dirimu sendiri.`,

  braceletMessage: `Gelang yang pernah aku kasih bukan hanya sebatas cendera mata, tapi itu adalah simbol dari kita yang pernah berjuang bersama di sini. Semoga gelangnya tetap aman dan bisa dipakai terus, ya. Jujur saja, membutuhkan waktu yang sedikit lama untuk menentukan gelang apa yang cocok untuk kita bertiga.`,

  successMessage: `Semoga secepatnya kita mendapatkan kabar baik dan mendapat kesuksesan, dan akhirnya kita bisa bertemu kembali dengan takdir terbaik kita.`,

  finalMessage: `Benar apa yang kamu bilang, ini bukan perpisahan, tapi ini adalah awal dari versi kita yang lain dan akan memupuk kebanggaan satu sama lain.`,
}

/* =========================================================
   STAR SEA
========================================================= */

function StarSea() {
  const groupRef =
    useRef<THREE.Group>(null)

  useFrame(
    ({
      clock,
    }) => {
      if (!groupRef.current) {
        return
      }

      const time =
        clock.elapsedTime

      groupRef.current.rotation.y =
        time * 0.006

      groupRef.current.rotation.x =
        Math.sin(
          time * 0.07,
        ) * 0.02
    },
  )

  return (
    <group
      ref={groupRef}
    >
      <Stars
        radius={100}
        depth={65}
        count={2400}
        factor={2.4}
        saturation={0}
        fade
        speed={0.18}
      />

      <Sparkles
        count={180}
        scale={[
          22,
          14,
          30,
        ]}
        size={1.7}
        speed={0.12}
        opacity={0.45}
        color="#c9a7ff"
      />

      <Sparkles
        count={90}
        scale={[
          12,
          8,
          20,
        ]}
        size={2.7}
        speed={0.08}
        opacity={0.3}
        color="#8c52ff"
      />
    </group>
  )
}

/* =========================================================
   STAR DUST
========================================================= */

function StarDust() {
  const points =
    useRef<THREE.Points>(null)

  const count = 180

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
          24

        positions[i3 + 1] =
          (Math.random() -
            0.5) *
          14

        positions[i3 + 2] =
          (Math.random() -
            0.5) *
          30

        speeds[i] =
          0.03 +
          Math.random() *
            0.1
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

      const position =
        points.current
          .geometry
          .attributes
          .position

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const index =
          i * 3 + 1

        let y =
          position.array[
            index
          ] as number

        y +=
          data.speeds[i] *
          delta

        if (y > 7) {
          y = -7
        }

        position.array[
          index
        ] = y
      }

      position.needsUpdate =
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
        size={0.035}
        color="#b98cff"
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/* =========================================================
   STORM PARTICLES
========================================================= */

function StormParticles() {
  const group =
    useRef<THREE.Group>(null)

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
        Math.sin(
          time * 0.08,
        ) * 0.15

      group.current.rotation.z =
        Math.sin(
          time * 0.12,
        ) * 0.035
    },
  )

  return (
    <group
      ref={group}
    >
      <Sparkles
        count={150}
        scale={[
          15,
          10,
          20,
        ]}
        size={1.2}
        speed={0.25}
        opacity={0.4}
        color="#a66bff"
      />

      <Sparkles
        count={70}
        scale={[
          8,
          6,
          14,
        ]}
        size={2}
        speed={0.35}
        opacity={0.28}
        color="#e0c7ff"
      />
    </group>
  )
}

/* =========================================================
   DRAGON ORBITING LIGHTNING ORBS
========================================================= */

function DragonStormOrbs() {
  const group =
    useRef<THREE.Group>(null)

  const orbCount = 6

  const orbs =
    useMemo(
      () =>
        Array.from(
          {
            length:
              orbCount,
          },
          (
            _,
            index,
          ) => ({
            angle:
              (index /
                orbCount) *
              Math.PI *
              2,

            radius:
              2.1 +
              (index % 2) *
                0.25,

            speed:
              0.28 +
              (index % 3) *
                0.07,

            phase:
              index * 0.8,
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
        time * 0.1

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
              time * 1.2 +
                data.phase,
            ) *
              0.15

          child.position.x =
            Math.cos(angle) *
            radius

          child.position.z =
            Math.sin(angle) *
            radius

          child.position.y =
            Math.sin(
              time * 1.5 +
                data.phase,
            ) *
              0.45
        },
      )
    },
  )

  return (
    <group
      ref={group}
    >
      {orbs.map(
        (_, index) => (
          <group
            key={index}
          >
            <mesh>
              <sphereGeometry
                args={[
                  0.055,
                  8,
                  8,
                ]}
              />

              <meshBasicMaterial
                color="#ffffff"
              />
            </mesh>

            <mesh>
              <sphereGeometry
                args={[
                  0.13,
                  8,
                  8,
                ]}
              />

              <meshBasicMaterial
                color="#a96bff"
                transparent
                opacity={0.65}
                depthWrite={false}
                blending={
                  THREE.AdditiveBlending
                }
              />
            </mesh>

            <mesh>
              <sphereGeometry
                args={[
                  0.27,
                  8,
                  8,
                ]}
              />

              <meshBasicMaterial
                color="#6d2cff"
                transparent
                opacity={0.1}
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
   DRAGON AURA
========================================================= */

function DragonAura() {
  const group =
    useRef<THREE.Group>(null)

  useFrame(
    ({
      clock,
    }) => {
      if (!group.current) {
        return
      }

      const time =
        clock.elapsedTime

      group.current.scale.setScalar(
        1 +
          Math.sin(
            time * 1.2,
          ) *
            0.045,
      )

      group.current.rotation.y =
        time * 0.05
    },
  )

  return (
    <group
      ref={group}
    >
      <mesh>
        <sphereGeometry
          args={[
            2.3,
            24,
            24,
          ]}
        />

        <meshBasicMaterial
          color="#7137ff"
          transparent
          opacity={0.035}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </mesh>

      <mesh
        scale={[
          1.25,
          0.7,
          1.25,
        ]}
      >
        <sphereGeometry
          args={[
            2,
            24,
            24,
          ]}
        />

        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.035}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </mesh>
    </group>
  )
}

/* =========================================================
   DRAGON
========================================================= */

function Dragon() {
  const rootRef =
    useRef<THREE.Group>(null)

  const modelRef =
    useRef<THREE.Group>(null)

  const { scene } =
    useGLTF(
      DRAGON_PATH,
    )

  const dragon =
    useMemo(() => {
      const clone =
        cloneSkeleton(scene)

      clone.updateMatrixWorld(
        true,
      )

      const box =
        new THREE.Box3().setFromObject(
          clone,
        )

      const center =
        new THREE.Vector3()

      const size =
        new THREE.Vector3()

      box.getCenter(center)
      box.getSize(size)

      const largest =
        Math.max(
          size.x,
          size.y,
          size.z,
        )

      const target =
        4.4

      const scale =
        target /
        largest

      clone.scale.setScalar(
        scale,
      )

      clone.position.set(
        -center.x *
          scale,

        -center.y *
          scale,

        -center.z *
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
                        '#5c25d6',
                      )

                    mat.emissiveIntensity =
                      0.28
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
                  '#5c25d6',
                )

              mat.emissiveIntensity =
                0.28
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
      if (!rootRef.current) {
        return
      }

      if (!modelRef.current) {
        return
      }

      const time =
        clock.elapsedTime

      /*
       * FLOAT
       */

      rootRef.current.position.y =
        Math.sin(
          time * 0.8,
        ) *
          0.22

      /*
       * SLOW ORBIT
       */

      rootRef.current.position.x =
        Math.sin(
          time * 0.22,
        ) *
          0.65

      rootRef.current.position.z =
        Math.cos(
          time * 0.22,
        ) *
          0.38

      /*
       * ROTATION
       */

      rootRef.current.rotation.y =
        time * 0.12

      /*
       * BANK
       */

      rootRef.current.rotation.z =
        Math.sin(
          time * 0.5,
        ) *
          0.08

      /*
       * BREATHING
       */

      modelRef.current.scale.setScalar(
        1 +
          Math.sin(
            time * 1.2,
          ) *
            0.018,
      )

      modelRef.current.rotation.z =
        Math.sin(
          time * 0.7,
        ) *
          0.025
    },
  )

  return (
    <group
      ref={rootRef}
    >
      <DragonAura />

      <group
        ref={modelRef}
      >
        <primitive
          object={dragon}
        />
      </group>

      <DragonStormOrbs />

      <pointLight
        color="#762cff"
        intensity={7}
        distance={9}
        decay={2}
      />

      <pointLight
        color="#c084fc"
        intensity={3}
        distance={6}
        decay={2}
      />
    </group>
  )
}

useGLTF.preload(
  DRAGON_PATH,
)

/* =========================================================
   WORLD
========================================================= */

function World() {
  return (
    <>
      <color
        attach="background"
        args={[
          '#04020a',
        ]}
      />

      <fog
        attach="fog"
        args={[
          '#08040f',
          8,
          35,
        ]}
      />

      <ambientLight
        intensity={1}
      />

      <directionalLight
        position={[
          5,
          8,
          8,
        ]}
        intensity={2}
        color="#e6d7ff"
      />

      <directionalLight
        position={[
          -5,
          3,
          4,
        ]}
        intensity={1.6}
        color="#7c3aed"
      />

      <pointLight
        position={[
          0,
          2,
          4,
        ]}
        intensity={4}
        distance={14}
        decay={2}
        color="#8b5cf6"
      />

      <StarSea />

      <StarDust />

      <StormParticles />

      <Suspense
        fallback={
          <Sparkles
            count={100}
            scale={[
              5,
              5,
              5,
            ]}
            size={2}
            speed={0.25}
            color="#9f6cff"
          />
        }
      >
        <Dragon />
      </Suspense>

      <Environment
        preset="night"
      />
    </>
  )
}


/* =========================================================
   BOOK DRAGON WORLD
   Transparent canvas placed INSIDE the open book.
   The paper is intentionally translucent so the dragon,
   stars and storm remain visible when the book opens.
========================================================= */

function BookDragonWorld() {
  return (
    <>
      <ambientLight intensity={1.15} />

      <directionalLight
        position={[4, 6, 7]}
        intensity={2.2}
        color="#eadcff"
      />

      <pointLight
        position={[0, 0.5, 3]}
        intensity={5}
        distance={12}
        decay={2}
        color="#8b5cf6"
      />

      <pointLight
        position={[-2, 1, 1]}
        intensity={2.5}
        distance={8}
        decay={2}
        color="#c084fc"
      />

      <StarSea />
      <StarDust />
      <StormParticles />

      <Suspense
        fallback={
          <Sparkles
            count={70}
            scale={[5, 4, 6]}
            size={2}
            speed={0.25}
            color="#b77cff"
          />
        }
      >
        <Dragon />
      </Suspense>
    </>
  )
}

/* =========================================================
   PAGE
========================================================= */

function SectionPhoto({
  index,
}: {
  index: number
}) {
  const memory = memories[index]

  return (
    <div className="section-memory">
      <MemoryPhoto
        memory={memory}
        index={index}
      />
    </div>
  )
}

function BookPage({
  children,
  side,
  pageNumber,
  className = '',
}: {
  children: React.ReactNode
  side: 'left' | 'right'
  pageNumber: string
  className?: string
}) {
  return (
    <div
      className={`book-page ${side} ${className}`}
    >
      <div className="page-no">
        {pageNumber}
      </div>

      <div className="page-inner">
        {children}
      </div>

      <div className="page-edge" />
    </div>
  )
}

/* =========================================================
   PHOTO
========================================================= */

function MemoryPhoto({
  memory,
  index,
}: {
  memory: (typeof memories)[number]
  index: number
}) {
  const [failed, setFailed] =
    useState(false)

  return (
    <div
      className={`memory-photo memory-photo-${index + 1}`}
    >
      {!failed && (
        <img
          src={memory.image}
          alt=""
          onError={() =>
            setFailed(true)
          }
        />
      )}

      {failed && (
        <div className="photo-placeholder">
          <span>
            MEMORY
          </span>

          <small>
            {memory.label}
          </small>
        </div>
      )}

      <div className="photo-glow" />

      <div className="photo-caption">
        {memory.label}
      </div>
    </div>
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
            length: 28,
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
          }),
        ),
      [],
    )

  return (
    <div className="floating-embers">
      {embers.map(
        (
          ember,
          index,
        ) => (
          <span
            key={index}
            style={{
              left: `${ember.left}%`,
              animationDelay: `${ember.delay}s`,
              animationDuration: `${ember.duration}s`,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
            }}
          />
        ),
      )}
    </div>
  )
}

/* =========================================================
   MAIN
========================================================= */

export function BayuExperience() {
  const [
    started,
    setStarted,
  ] = useState(false)

  const [
    opening,
    setOpening,
  ] = useState(true)

  const [
    page,
    setPage,
  ] = useState(0)

  // On phones each side of the desktop spread becomes its own physical page.
  // 0 = left page, 1 = right page.
  const [
    mobileSide,
    setMobileSide,
  ] = useState<0 | 1>(0)

  const [
    isMobile,
    setIsMobile,
  ] = useState(false)

  const [
    sound,
    setSound,
  ] = useState(true)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 680px)')

    const update = () => {
      setIsMobile(media.matches)
    }

    update()
    media.addEventListener('change', update)

    return () => {
      media.removeEventListener('change', update)
    }
  }, [])

  /* =======================================================
     BACKGROUND MUSIC
     MP3 ONLY — starts on the user's first interaction
     with the INTRO screen and continues through the book.
  ======================================================= */

  const musicRef =
    useRef<HTMLAudioElement | null>(null)

  const [
    flipping,
    setFlipping,
  ] = useState(false)

  const [
    flipDirection,
    setFlipDirection,
  ] = useState<'forward' | 'backward'>('forward')

  const bookRef =
    useRef<HTMLDivElement>(
      null,
    )


  /*
   * =======================================================
   * START BOOK
   * =======================================================
   */

  const startBackgroundMusic =
    () => {
      const music = musicRef.current

      if (!music || !sound) {
        return
      }

      music.volume = 0.32

      const playPromise =
        music.play()

      if (playPromise !== undefined) {
        void playPromise.catch((error) => {
          console.error('Bayu MP3 playback failed:', error)
        })
      }
    }

  // Try to start the MP3 immediately when the intro is mounted.
  // Browsers may block audible autoplay; the intro pointer handler above
  // remains as the fallback and starts the same audio without restarting it.
  useEffect(() => {
    startBackgroundMusic()
  }, [])

  const openBook =
    () => {
      // The button click is a user gesture, so this is allowed by browsers.
      startBackgroundMusic()

      setStarted(true)

      window.setTimeout(
        () => {
          setOpening(false)
        },
        1500,
      )
    }

  /*
   * =======================================================
   * PAGE NAVIGATION
   * =======================================================
   */

  const nextPage =
    () => {
      if (flipping) {
        return
      }

      if (isMobile) {
        const lastMobilePage =
          pages.length * 2 - 1
        const currentMobilePage =
          page * 2 + mobileSide

        if (currentMobilePage >= lastMobilePage) {
          return
        }

        setFlipDirection('forward')
        setFlipping(true)
        setMobileSide((side) => {
          if (side === 0) {
            return 1
          }

          setPage((current) =>
            Math.min(
              current + 1,
              pages.length - 1,
            ),
          )
          return 0
        })
      } else {
        if (page >= pages.length - 1) {
          return
        }

        setFlipDirection('forward')
        setFlipping(true)
        setPage((current) =>
          Math.min(
            current + 1,
            pages.length - 1,
          ),
        )
      }

      window.setTimeout(() => {
        setFlipping(false)
      }, 850)
    }

  const previousPage =
    () => {
      if (flipping) {
        return
      }

      if (isMobile) {
        const currentMobilePage =
          page * 2 + mobileSide

        if (currentMobilePage <= 0) {
          return
        }

        setFlipDirection('backward')
        setFlipping(true)
        setMobileSide((side) => {
          if (side === 1) {
            return 0
          }

          setPage((current) =>
            Math.max(current - 1, 0),
          )
          return 1
        })
      } else {
        if (page <= 0) {
          return
        }

        setFlipDirection('backward')
        setFlipping(true)
        setPage((current) =>
          Math.max(current - 1, 0),
        )
      }

      window.setTimeout(() => {
        setFlipping(false)
      }, 850)
    }

  /*
   * =======================================================
   * KEYBOARD
   * =======================================================
   */

  useEffect(() => {
    const handleKey =
      (
        event: KeyboardEvent,
      ) => {
        if (!started) {
          return
        }

        if (
          event.key ===
          'ArrowRight'
        ) {
          nextPage()
        }

        if (
          event.key ===
          'ArrowLeft'
        ) {
          previousPage()
        }
      }

    window.addEventListener(
      'keydown',
      handleKey,
    )

    return () =>
      window.removeEventListener(
        'keydown',
        handleKey,
      )
  })

  /*
   * =======================================================
   * TOUCH SWIPE
   * =======================================================
   */

  const touchStart =
    useRef<number | null>(
      null,
    )

  const handleTouchStart =
    (
      event: React.TouchEvent,
    ) => {
      touchStart.current =
        event.touches[0]?.clientX ??
        null
    }

  const handleTouchEnd =
    (
      event: React.TouchEvent,
    ) => {
      if (
        touchStart.current ===
        null
      ) {
        return
      }

      const end =
        event.changedTouches[0]
          ?.clientX ?? 0

      const distance =
        end -
        touchStart.current

      if (
        Math.abs(distance) <
        45
      ) {
        return
      }

      if (distance < 0) {
        nextPage()
      } else {
        previousPage()
      }

      touchStart.current =
        null
    }

  return (
    <main className="bayu-experience">
      <audio
        ref={musicRef}
        src={MUSIC_PATH}
        loop
        preload="auto"
        aria-hidden="true"
      />
      <style>
        {`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          width: 100%;
          min-height: 100%;
          background: #030107;
        }

        body {
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

        .bayu-experience {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          color: #f8f3ff;
          background:
            radial-gradient(
              circle at 50% 40%,
              rgba(107, 43, 190, .17),
              transparent 35%
            ),
            #030107;
        }

        /* =================================================
           WORLD
        ================================================= */

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

        .atmosphere {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at center,
              transparent 20%,
              rgba(3, 1, 8, .35) 55%,
              rgba(3, 1, 8, .82) 100%
            );
        }

        .storm-glow {
          position: fixed;
          left: 50%;
          top: 48%;
          width: 65vw;
          height: 65vw;
          max-width: 850px;
          max-height: 850px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(126, 60, 255, .12),
              rgba(98, 40, 180, .05) 35%,
              transparent 68%
            );
          filter: blur(24px);
          pointer-events: none;
          z-index: 1;
          animation:
            stormPulse 5s ease-in-out infinite;
        }

        @keyframes stormPulse {
          0%,
          100% {
            opacity: .65;
            transform:
              translate(-50%, -50%)
              scale(.96);
          }

          50% {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              scale(1.04);
          }
        }

        /* =================================================
           EMBERS
        ================================================= */

        .floating-embers {
          position: fixed;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-embers span {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          background: #b875ff;
          box-shadow:
            0 0 6px #a855f7,
            0 0 16px rgba(168, 85, 247, .8);
          opacity: 0;
          animation:
            emberFloat
            8s linear infinite;
        }

        @keyframes emberFloat {
          0% {
            transform:
              translate3d(
                0,
                20px,
                0
              )
              scale(.5);
            opacity: 0;
          }

          10% {
            opacity: .7;
          }

          75% {
            opacity: .4;
          }

          100% {
            transform:
              translate3d(
                30px,
                -105vh,
                0
              )
              scale(1.3);
            opacity: 0;
          }
        }

        /* =================================================
           INTRO
        ================================================= */

        .intro-screen {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              rgba(92, 35, 170, .16),
              transparent 40%
            ),
            #030107;
          transition:
            opacity 1.2s ease,
            visibility 1.2s ease;
        }

        .intro-screen.is-leaving {
          opacity: 0;
          visibility: hidden;
        }

        .intro-stars {
          position: absolute;
          pointer-events: none;
          inset: 0;
          background-image:
            radial-gradient(
              circle,
              rgba(255,255,255,.8) 0 1px,
              transparent 1.5px
            );
          background-size:
            80px 80px;
          opacity: .32;
          animation:
            starsDrift 25s linear infinite;
        }

        @keyframes starsDrift {
          from {
            transform:
              translate3d(
                0,
                0,
                0
              );
          }

          to {
            transform:
              translate3d(
                -80px,
                50px,
                0
              );
          }
        }

        .intro-content {
          position: relative;
          z-index: 20;
          pointer-events: auto;
          width: min(
            1100px,
            92vw
          );
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(320px, 1fr);
          gap: 70px;
          align-items: center;
        }

        .intro-copy {
          padding-left: 20px;
          animation:
            introCopyIn
            1.3s
            cubic-bezier(
              .16,
              1,
              .3,
              1
            )
            both;
        }

        @keyframes introCopyIn {
          from {
            opacity: 0;
            transform:
              translateX(-35px);
          }

          to {
            opacity: 1;
            transform:
              translateX(0);
          }
        }

        .intro-eyebrow {
          margin: 0 0 18px;
          color: #b78aff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .35em;
          text-transform: uppercase;
        }

        .intro-content h1 {
          margin: 0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              58px,
              8vw,
              108px
            );
          line-height: .88;
          font-weight: 400;
          letter-spacing: -.055em;
          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #eadbff 48%,
              #a970ff 100%
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .intro-subtitle {
          max-width: 430px;
          margin: 26px 0 0;
          color: rgba(
            237,
            226,
            255,
            .7
          );
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 19px;
          line-height: 1.8;
        }

        .enter-button {
          margin-top: 36px;
          padding: 15px 24px;
          border: 1px solid
            rgba(
              186,
              134,
              255,
              .55
            );
          border-radius: 999px;
          color: #fff;
          background:
            linear-gradient(
              135deg,
              rgba(
                122,
                52,
                221,
                .28
              ),
              rgba(
                66,
                30,
                120,
                .18
              )
            );
          backdrop-filter: blur(12px);
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          transition:
            transform .3s ease,
            box-shadow .3s ease,
            border-color .3s ease;
        }

        .enter-button:hover {
          transform:
            translateY(-3px);
          border-color:
            rgba(
              214,
              178,
              255,
              .9
            );
          box-shadow:
            0 0 30px
            rgba(
              139,
              92,
              246,
              .3
            );
        }

        /* =================================================
           FLYING BOOK
        ================================================= */

        .flying-book {
          position: relative;
          width: min(
            460px,
            80vw
          );
          aspect-ratio: 1.32;
          perspective: 1800px;
          animation:
            bookFloat
            4.8s
            ease-in-out
            infinite;
        }

        @keyframes bookFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotateZ(-1deg);
          }

          50% {
            transform:
              translateY(-17px)
              rotateZ(1deg);
          }
        }

        .book-shadow {
          position: absolute;
          left: 8%;
          right: 8%;
          bottom: -35px;
          height: 45px;
          border-radius: 50%;
          background:
            rgba(
              113,
              49,
              199,
              .25
            );
          filter: blur(28px);
          animation:
            shadowPulse
            4.8s
            ease-in-out
            infinite;
        }

        @keyframes shadowPulse {
          0%,
          100% {
            transform:
              scaleX(.85);
            opacity: .5;
          }

          50% {
            transform:
              scaleX(1);
            opacity: .8;
          }
        }

        .book-cover {
          position: absolute;
          inset: 0;
          border:
            1px solid
            rgba(
              199,
              163,
              255,
              .5
            );
          border-radius:
            7px 15px 15px 7px;
          background:
            linear-gradient(
              135deg,
              #160b2c,
              #351467 50%,
              #10071e
            );
          box-shadow:
            0 30px 80px
              rgba(
                0,
                0,
                0,
                .55
              ),
            inset 0 0 40px
              rgba(
                177,
                116,
                255,
                .08
              );
        }

        .book-cover::before {
          content: "";
          position: absolute;
          inset: 14px;
          border:
            1px solid
            rgba(
              207,
              178,
              255,
              .2
            );
          border-radius:
            3px 10px 10px 3px;
        }

        .book-cover-title {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .book-cover-title span {
          color: #c5a0ff;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .35em;
        }

        .book-cover-title strong {
          margin-top: 14px;
          font-family:
            Georgia,
            serif;
          font-size: 38px;
          font-weight: 400;
        }

        .book-cover-title small {
          margin-top: 9px;
          color:
            rgba(
              255,
              255,
              255,
              .45
            );
          font-size: 10px;
          letter-spacing: .16em;
        }

        .book-spine {
          position: absolute;
          left: -12px;
          top: 5px;
          bottom: 5px;
          width: 18px;
          border-radius:
            7px 0 0 7px;
          background:
            linear-gradient(
              90deg,
              #0b0513,
              #4e2390,
              #170a2b
            );
          box-shadow:
            inset
            -3px 0
            5px
            rgba(
              0,
              0,
              0,
              .5
            );
        }

        .intro-dragon {
          position: absolute;
          inset: -15% -15%;
          z-index: 4;
          pointer-events: none;
        }

        /* =================================================
           EXPERIENCE
        ================================================= */

        .experience {
          position: relative;
          z-index: 5;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding:
            38px
            38px
            100px;
          opacity: 0;
          animation:
            experienceIn
            1.2s
            .2s
            ease
            forwards;
        }

        @keyframes experienceIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        /* =================================================
           BOOK
        ================================================= */

        .book-wrapper {
          position: relative;
          width:
            min(
              1180px,
              94vw
            );
          height:
            min(
              720px,
              78vh
            );
          min-height: 580px;
          perspective: 2200px;
        }

        .book {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style:
            preserve-3d;
          filter:
            drop-shadow(
              0 35px 70px
              rgba(
                0,
                0,
                0,
                .6
              )
            );
        }\n\n        /* =================================================\n           DRAGON INSIDE THE BOOK\n        ================================================= */\n\n        .book-dragon-layer {\n          position: absolute;\n          inset: 12px;\n          z-index: 2;\n          overflow: hidden;\n          border-radius: 4px;\n          pointer-events: none;\n          opacity: 1;\n          mix-blend-mode: screen;\n          filter: saturate(1.12) contrast(1.05);\n        }\n\n        .book-dragon-layer::before {\n          content: '';\n          position: absolute;\n          inset: 14%;\n          border-radius: 50%;\n          background: radial-gradient(ellipse at center, rgba(139,92,246,.22), rgba(109,40,217,.08) 34%, transparent 70%);\n          filter: blur(25px);\n          animation: bookDragonBreath 5s ease-in-out infinite;\n        }\n\n        .book-dragon-layer canvas {\n          position: absolute !important;\n          inset: 0;\n          width: 100% !important;\n          height: 100% !important;\n          pointer-events: none !important;\n        }\n\n        @keyframes bookDragonBreath {\n          0%, 100% { opacity: .55; transform: scale(.94); }\n          50% { opacity: 1; transform: scale(1.08); }\n        }\n

        .book-shell {
          position: absolute;
          z-index: 1;
          inset: 0;
          border-radius: 8px;
          background:
            linear-gradient(
              90deg,
              #130820,
              #25103e 50%,
              #12071e
            );
          box-shadow:
            inset 0 0 0 1px
              rgba(
                207,
                178,
                255,
                .2
              ),
            inset 0 0 80px
              rgba(
                114,
                54,
                190,
                .08
              );
        }

        .book-spread {
          position: absolute;
          z-index: 3;
          inset: 12px;
          display: grid;
          grid-template-columns:
            1fr 1fr;
          overflow: hidden;
          border-radius: 4px;
          background:
            linear-gradient(90deg, rgba(241,233,220,.82), rgba(249,243,234,.72) 50%, rgba(234,221,205,.78));
          backdrop-filter: blur(1.2px);
          -webkit-backdrop-filter: blur(1.2px);
          box-shadow:
            inset 0 0 45px
              rgba(
                74,
                36,
                94,
                .18
              );
        }

        .book-page {
          position: relative;
          overflow: hidden;
          color: #261a2f;
          background:
            radial-gradient(circle at 20% 18%, rgba(255,255,255,.74), transparent 30%),
            radial-gradient(circle at 82% 78%, rgba(160,112,255,.13), transparent 34%),
            linear-gradient(135deg, rgba(246,239,228,.76), rgba(233,221,205,.68));
          backdrop-filter: blur(1.5px);
          -webkit-backdrop-filter: blur(1.5px);
          box-shadow:
            inset
            0 0 45px
            rgba(
              92,
              57,
              70,
              .1
            );
        }

        .book-page.left {
          border-right:
            1px solid
            rgba(
              48,
              28,
              58,
              .16
            );
        }

        .book-page.right {
          border-left:
            1px solid
            rgba(
              48,
              28,
              58,
              .08
            );
        }

        .book-page::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .18;
          background-image:
            radial-gradient(
              rgba(
                85,
                56,
                73,
                .35
              ) .6px,
              transparent .6px
            );
          background-size:
            4px 4px;
          mix-blend-mode:
            multiply;
        }

        .page-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          padding:
            50px
            55px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color:
            rgba(
              101,
              55,
              142,
              .35
            )
            transparent;
        }

        .page-inner::-webkit-scrollbar {
          width: 4px;
        }

        .page-inner::-webkit-scrollbar-thumb {
          background:
            rgba(
              101,
              55,
              142,
              .35
            );
        }

        .page-no {
          position: absolute;
          z-index: 5;
          bottom: 20px;
          color:
            rgba(
              50,
              28,
              58,
              .4
            );
          font-family:
            Georgia,
            serif;
          font-size: 11px;
          letter-spacing: .2em;
        }

        .book-page.left
          .page-no {
          left: 28px;
        }

        .book-page.right
          .page-no {
          right: 28px;
        }

        .page-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 14px;
          pointer-events: none;
          opacity: .2;
        }

        .book-page.left
          .page-edge {
          right: 0;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(
                48,
                25,
                61,
                .22
              )
            );
        }

        .book-page.right
          .page-edge {
          left: 0;
          background:
            linear-gradient(
              90deg,
              rgba(
                48,
                25,
                61,
                .22
              ),
              transparent
            );
        }

        /* =================================================\n           MAGICAL PAGE DETAILS\n        ================================================= */\n\n        .page-magic-orbit {\n          position: absolute;\n          width: 180px;\n          height: 180px;\n          right: -55px;\n          top: -55px;\n          border: 1px solid rgba(130,78,211,.22);\n          border-radius: 50%;\n          pointer-events: none;\n          animation: magicOrbit 12s linear infinite;\n        }\n\n        .page-magic-orbit::before,\n        .page-magic-orbit::after {\n          content: '';\n          position: absolute;\n          inset: 18px;\n          border: 1px solid rgba(139,92,246,.16);\n          border-radius: 50%;\n        }\n\n        .page-magic-orbit::after {\n          inset: 42px;\n          border-color: rgba(192,132,252,.18);\n        }\n\n        .page-magic-orbit span {\n          position: absolute;\n          width: 5px;\n          height: 5px;\n          border-radius: 50%;\n          background: #a970ff;\n          box-shadow: 0 0 12px #8b5cf6, 0 0 24px rgba(139,92,246,.6);\n        }\n\n        .page-magic-orbit span:nth-child(1) { left: 15%; top: 35%; }\n        .page-magic-orbit span:nth-child(2) { right: 12%; top: 22%; }\n        .page-magic-orbit span:nth-child(3) { left: 48%; bottom: 8%; }\n\n        @keyframes magicOrbit {\n          to { transform: rotate(360deg); }\n        }\n\n        .opening-title {\n          max-width: 430px;\n          text-shadow: 0 4px 24px rgba(99,45,150,.12);\n        }\n\n        .opening-story {\n          position: relative;\n          max-width: 510px;\n          padding-left: 18px;\n          border-left: 1px solid rgba(111,67,164,.28);\n        }\n\n        .opening-signature {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          margin-top: 24px;\n          color: #6f43a4;\n          font-family: Georgia, serif;\n          font-size: 15px;\n          font-style: italic;\n        }\n\n        .opening-signature i {\n          font-style: normal;\n          animation: signatureSpark 2.8s ease-in-out infinite;\n        }\n\n        @keyframes signatureSpark {\n          0%, 100% { opacity: .35; transform: scale(.85) rotate(0deg); }\n          50% { opacity: 1; transform: scale(1.15) rotate(20deg); }\n        }\n\n        .ending-letter {\n          margin-top: 20px;\n          max-height: 285px;\n          overflow-y: auto;\n          padding-right: 8px;\n          scrollbar-width: thin;\n          scrollbar-color: rgba(111,67,164,.35) transparent;\n        }\n\n        .ending-letter p {\n          margin: 0 0 18px;\n          color: rgba(38,26,47,.78);\n          font-family: Georgia, serif;\n          font-size: 13px;\n          line-height: 1.85;\n        }\n\n        /* =================================================
           PAGE CONTENT
        ================================================= */

        .page-label {
          margin: 0 0 14px;
          color: #6f43a4;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .28em;
          text-transform: uppercase;
        }

        .page-title {
          margin: 0 0 25px;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              28px,
              3vw,
              48px
            );
          line-height: 1;
          font-weight: 400;
          letter-spacing: -.04em;
          color: #281833;
        }

        .page-text {
          margin: 0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size:
            clamp(
              15px,
              1.35vw,
              18px
            );
          line-height: 1.85;
          color: #3c2a42;
          white-space: pre-wrap;
        }

        .page-text + .page-text {
          margin-top: 26px;
        }

        .quote-mark {
          position: absolute;
          top: 25px;
          right: 40px;
          color:
            rgba(
              113,
              64,
              161,
              .1
            );
          font-family:
            Georgia,
            serif;
          font-size: 120px;
          line-height: 1;
        }

        /* =================================================
           PAGE DECORATION
        ================================================= */

        .page-orb {
          position: absolute;
          width: 220px;
          height: 220px;
          right: -90px;
          bottom: -100px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(
                137,
                76,
                205,
                .18
              ),
              transparent 70%
            );
          filter: blur(10px);
        }

        .page-line {
          width: 55px;
          height: 1px;
          margin: 0 0 22px;
          background:
            linear-gradient(
              90deg,
              #7545a8,
              transparent
            );
        }

        /* =================================================
           PHOTO PAGE
        ================================================= */

        .memory-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 22px;
          margin-top: 15px;
        }

        .memory-photo {
          position: relative;
          min-height: 180px;
          overflow: hidden;
          border:
            8px solid
            rgba(
              255,
              255,
              255,
              .72
            );
          background: #25132e;
          box-shadow:
            0 16px 30px
              rgba(
                50,
                26,
                60,
                .18
              );
          transform:
            rotate(-2deg);
          transition:
            transform .6s
            cubic-bezier(
              .16,
              1,
              .3,
              1
            );
        }

        .memory-photo:nth-child(
          even
        ) {
          transform:
            rotate(2.5deg)
            translateY(
              16px
            );
        }

        .memory-photo:hover {
          transform:
            rotate(0deg)
            translateY(
              -7px
            )
            scale(1.025);
          z-index: 5;
        }

        .memory-photo img {
          width: 100%;
          height: 100%;
          min-height: 180px;
          object-fit: cover;
          display: block;
          filter:
            saturate(.85)
            contrast(1.04);
        }

        .photo-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              135deg,
              rgba(
                177,
                115,
                255,
                .12
              ),
              transparent 50%,
              rgba(
                60,
                20,
                110,
                .2
              )
            );
        }

        .photo-caption {
          position: absolute;
          left: 9px;
          bottom: 7px;
          padding:
            5px 8px;
          color: #fff;
          background:
            rgba(
              22,
              10,
              32,
              .62
            );
          backdrop-filter:
            blur(7px);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: .16em;
        }

        .photo-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color:
            rgba(
              255,
              255,
              255,
              .55
            );
          background:
            radial-gradient(
              circle,
              #49216f,
              #170a22
            );
          text-align: center;
        }

        .photo-placeholder span {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .25em;
        }

        .photo-placeholder small {
          font-size: 10px;
        }

        /* =================================================
           SECTION PHOTO
        ================================================= */

        .section-memory {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 14px;
          margin: 22px 0 4px;
        }

        .section-memory .memory-photo {
          width: min(100%, 420px);
          min-height: 145px;
          margin: 0 auto;
          animation: memoryFloat 6s ease-in-out infinite;
        }

        .section-memory .memory-photo:nth-child(even) {
          animation-delay: -2s;
        }

        .section-memory::before {
          content: '✦';
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          color: #8d5bb5;
          font-size: 13px;
          text-shadow: 0 0 14px rgba(141,91,181,.5);
          animation: sectionSpark 2.8s ease-in-out infinite;
        }

        @keyframes memoryFloat {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-7px) rotate(1deg); }
        }

        @keyframes sectionSpark {
          0%, 100% { opacity: .35; transform: translateX(-50%) scale(.85); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.25); }
        }

        /* =================================================
           BRACELET
        ================================================= */

        .bracelet-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 330px;
          margin-top: 10px;
          border-radius: 8px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              rgba(
                114,
                58,
                175,
                .22
              ),
              transparent 62%
            ),
            #24132d;
          box-shadow:
            inset 0 0 50px
              rgba(
                0,
                0,
                0,
                .25
              );
        }

        .bracelet-wrap img {
          width: 100%;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          display: block;
        }

        .bracelet-placeholder {
          text-align: center;
          color:
            rgba(
              255,
              255,
              255,
              .55
            );
        }

        .bracelet-placeholder strong {
          display: block;
          margin-bottom: 9px;
          color: #e1caff;
          font-family:
            Georgia,
            serif;
          font-size: 30px;
          font-weight: 400;
        }

        .bracelet-placeholder span {
          font-size: 9px;
          letter-spacing: .22em;
        }

        .bracelet-note {
          margin-top: 18px;
          font-family:
            Georgia,
            serif;
          font-size: 13px;
          line-height: 1.7;
          color:
            rgba(
              50,
              32,
              58,
              .7
            );
        }

        /* =================================================
           DRAGON PAGE
        ================================================= */

        .dragon-page {
          position: relative;
          padding: 0 !important;
          overflow: hidden !important;
          background:
            radial-gradient(
              circle at center,
              rgba(
                112,
                49,
                166,
                .16
              ),
              transparent 55%
            ),
            #eee5d9;
        }

        .dragon-page-copy {
          position: absolute;
          left: 45px;
          bottom: 45px;
          z-index: 5;
          max-width: 230px;
        }

        .dragon-page-copy h2 {
          margin: 0;
          font-family:
            Georgia,
            serif;
          font-size: 30px;
          font-weight: 400;
        }

        .dragon-page-copy p {
          margin: 10px 0 0;
          font-family:
            Georgia,
            serif;
          font-size: 12px;
          line-height: 1.7;
          color:
            rgba(
              50,
              31,
              60,
              .65
            );
        }

        .dragon-canvas {
          position: absolute;
          inset: 0;
        }

        .dragon-canvas canvas {
          width: 100% !important;
          height: 100% !important;
        }

        /* =================================================
           PAGE 08 — DRAGON + MEMORY PHOTO
           Keep the dragon canvas visible at the top, then
           place the final message and the actual photo inside
           the same parchment book page.
        ================================================= */

        .dragon-page {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          scrollbar-width: thin;
          scrollbar-color: rgba(101,55,142,.28) transparent;
        }

        .dragon-page::-webkit-scrollbar {
          width: 4px;
        }

        .dragon-page::-webkit-scrollbar-thumb {
          background: rgba(101,55,142,.28);
        }

        .dragon-page .dragon-canvas {
          position: relative;
          inset: auto;
          width: 100%;
          height: 250px;
          min-height: 250px;
          flex: 0 0 250px;
          z-index: 1;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 48%,
              rgba(139,92,246,.2),
              transparent 52%
            );
        }

        .dragon-page .dragon-page-copy {
          position: relative;
          left: auto;
          bottom: auto;
          width: 100%;
          max-width: none;
          padding: 12px 34px 48px;
          box-sizing: border-box;
          z-index: 5;
        }

        .dragon-page .dragon-page-copy .page-label {
          margin-top: 0;
        }

        .dragon-page .dragon-page-copy > h2 {
          margin-top: 8px;
        }

        .dragon-page .ending-letter {
          max-width: 560px;
          margin: 18px auto 0;
        }

        .dragon-page .ending-final-message {
          max-width: 560px;
          margin: 30px auto 0;
          padding: 0 8px;
        }

        .dragon-page .ending-book-photo {
          display: block;
          width: min(92%, 330px);
          margin: 24px auto 4px;
          position: relative;
          z-index: 10;
        }

        .dragon-page .ending-book-photo-paper {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }

        .dragon-page .ending-book-photo-image {
          display: block;
          width: 100%;
          min-height: 190px;
        }

        .dragon-page .ending-book-photo-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 190px;
          object-fit: cover;
        }

        .dragon-page .ending-book-photo-fallback {
          display: none;
        }

        .dragon-page .ending-book-photo-image.photo-missing .ending-book-photo-fallback {
          display: flex;
        }

        /* =================================================
           LETTER
        ================================================= */

        .letter-page {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .letter-opening {
          margin-bottom: 25px;
          font-family:
            Georgia,
            serif;
          font-size: 25px;
          color: #35223d;
        }

        .letter-highlight {
          position: relative;
          margin:
            28px 0;
          padding:
            25px 25px
            25px 28px;
          border-left:
            2px solid
            #8152ae;
          background:
            rgba(
              116,
              63,
              159,
              .055
            );
        }

        /* =================================================
           ENDING
        ================================================= */

        .ending-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .ending-symbol {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border:
            1px solid
            rgba(
              121,
              74,
              164,
              .25
            );
          border-radius: 50%;
          color: #7c45ac;
          font-size: 36px;
          box-shadow:
            0 0 50px
              rgba(
                130,
                73,
                190,
                .13
              );
          animation:
            endingPulse
            3s
            ease-in-out
            infinite;
        }

        @keyframes endingPulse {
          0%,
          100% {
            transform:
              scale(.96);
          }

          50% {
            transform:
              scale(1.04);
          }
        }

        .ending-page h2 {
          margin: 0;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(
              34px,
              4vw,
              58px
            );
          font-weight: 400;
          letter-spacing: -.04em;
        }

        .ending-page p {
          max-width: 400px;
          margin:
            22px auto 0;
          font-family:
            Georgia,
            serif;
          font-size: 16px;
          line-height: 1.8;
          color:
            rgba(
              53,
              35,
              62,
              .7
            );
        }

        /* =================================================
           PAGE FLIP
        ================================================= */

        .page-transition {
          position: absolute;
          inset: 12px;
          z-index: 30;
          pointer-events: none;
          perspective: 2200px;
        }

        .flip-page {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          transform-style:
            preserve-3d;
          background:
            linear-gradient(
              90deg,
              #f8f0e4,
              #e5d6c4
            );
          box-shadow:
            0 0 30px
              rgba(
                0,
                0,
                0,
                .15
              );
          backface-visibility:
            hidden;
        }

        .flip-page.forward {
          right: 0;
          transform-origin:
            left center;
          animation:
            flipForward
            .85s
            cubic-bezier(
              .22,
              .8,
              .18,
              1
            )
            both;
        }

        .flip-page.backward {
          left: 0;
          transform-origin:
            right center;
          animation:
            flipBackward
            .85s
            cubic-bezier(
              .22,
              .8,
              .18,
              1
            )
            both;
        }

        @keyframes flipForward {
          0% {
            transform:
              rotateY(0deg);
          }

          100% {
            transform:
              rotateY(-180deg);
          }
        }

        @keyframes flipBackward {
          0% {
            transform:
              rotateY(0deg);
          }

          100% {
            transform:
              rotateY(180deg);
          }
        }

        /* =================================================
           CONTROLS
        ================================================= */

        .book-controls {
          position: fixed;
          z-index: 50;
          left: 50%;
          bottom: 24px;
          transform:
            translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          padding:
            9px 11px;
          border:
            1px solid
            rgba(
              190,
              149,
              239,
              .2
            );
          border-radius: 999px;
          background:
            rgba(
              14,
              7,
              22,
              .72
            );
          backdrop-filter:
            blur(16px);
          box-shadow:
            0 12px 35px
              rgba(
                0,
                0,
                0,
                .35
              );
        }

        .book-controls button {
          width: 38px;
          height: 38px;
          border:
            1px solid
            rgba(
              198,
              160,
              255,
              .22
            );
          border-radius: 50%;
          color: #fff;
          background:
            rgba(
              255,
              255,
              255,
              .045
            );
          cursor: pointer;
          transition:
            background .25s ease,
            transform .25s ease,
            opacity .25s ease;
        }

        .book-controls button:hover:not(
          :disabled
        ) {
          transform:
            translateY(-2px);
          background:
            rgba(
              139,
              92,
              246,
              .22
            );
        }

        .book-controls button:disabled {
          opacity: .3;
          cursor: default;
        }

        .book-counter {
          min-width: 75px;
          color:
            rgba(
              245,
              235,
              255,
              .72
            );
          text-align: center;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .18em;
        }

        .sound-button {
          position: fixed;
          z-index: 50;
          top: 22px;
          right: 22px;
          padding:
            9px 13px;
          border:
            1px solid
            rgba(
              190,
              149,
              239,
              .2
            );
          border-radius: 999px;
          color:
            rgba(
              255,
              255,
              255,
              .72
            );
          background:
            rgba(
              14,
              7,
              22,
              .6
            );
          backdrop-filter:
            blur(12px);
          cursor: pointer;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .made-by {
          position: fixed;
          z-index: 50;
          left: 24px;
          bottom: 27px;
          color:
            rgba(
              255,
              255,
              255,
              .3
            );
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
        }


        /* =================================================
           MAGICAL HISTORY BOOK — ENHANCED VISUAL SYSTEM
        ================================================= */

        .intro-screen {
          background:
            radial-gradient(circle at 68% 44%, rgba(130, 72, 255, .22), transparent 27%),
            radial-gradient(circle at 30% 60%, rgba(198, 120, 255, .10), transparent 32%),
            linear-gradient(135deg, #020106 0%, #090313 48%, #160724 100%);
        }

        .intro-screen::before {
          content: "";
          position: absolute;
          inset: 7%;
          border: 1px solid rgba(210, 175, 255, .12);
          border-radius: 40px;
          pointer-events: none;
          box-shadow:
            inset 0 0 90px rgba(111, 58, 200, .08),
            0 0 90px rgba(111, 58, 200, .05);
        }

        .intro-screen::after {
          content: "✦   ✧   ✦   ✧   ✦";
          position: absolute;
          top: 26px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(215, 179, 255, .34);
          font-family: Georgia, serif;
          font-size: 10px;
          letter-spacing: .65em;
          pointer-events: none;
          animation: introSigils 4s ease-in-out infinite;
        }

        @keyframes introSigils {
          0%, 100% { opacity: .25; letter-spacing: .55em; }
          50% { opacity: .8; letter-spacing: .78em; }
        }

        .intro-content {
          position: relative;
          z-index: 20;
          pointer-events: auto;
          width: min(1220px, 94vw);
          grid-template-columns: minmax(300px, .82fr) minmax(420px, 1.18fr);
          gap: clamp(30px, 5vw, 90px);
        }

        .intro-copy {
          position: relative;
          z-index: 8;
        }

        .intro-copy::before {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          left: -70px;
          top: -55px;
          border: 1px solid rgba(174, 120, 255, .12);
          border-radius: 50%;
          box-shadow: 0 0 50px rgba(139, 92, 246, .08);
          animation: sigilSpin 20s linear infinite;
          pointer-events: none;
        }

        @keyframes sigilSpin {
          to { transform: rotate(360deg); }
        }

        .intro-dragon {
          position: absolute;
          inset: -18% -22%;
          z-index: 8;
          pointer-events: none;
          filter:
            drop-shadow(0 0 16px rgba(139, 92, 246, .45))
            drop-shadow(0 0 42px rgba(139, 92, 246, .22));
          animation: introDragonFloat 5.5s ease-in-out infinite;
        }

        /* Full-scene dragon: rendered as soon as the intro mounts and
           deliberately layered above the book cover. */
        .intro-dragon-orbit {
          inset: 0;
          z-index: 7;
          pointer-events: none !important;
          overflow: visible;
          opacity: .98;
          animation: introDragonFlight 12s ease-in-out infinite;
          will-change: transform;
        }

        .intro-dragon-orbit canvas {
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
          touch-action: none !important;
        }

        .intro-copy,
        .intro-copy * {
          pointer-events: auto;
        }

        .enter-button {
          position: relative;
          z-index: 100;
          pointer-events: auto !important;
          cursor: pointer;
        }

        @keyframes introDragonFlight {
          0%, 100% { transform: translate3d(3vw, 1vh, 0) rotate(-2deg) scale(1); }
          20% { transform: translate3d(-3vw, -2vh, 0) rotate(2deg) scale(1.035); }
          45% { transform: translate3d(-1vw, 3vh, 0) rotate(-1deg) scale(.98); }
          70% { transform: translate3d(4vw, -2vh, 0) rotate(2deg) scale(1.025); }
        }

        .intro-dragon canvas {
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
        }

        @keyframes introDragonFloat {
          0%, 100% {
            transform: translate3d(0, 5px, 0) rotate(-1deg) scale(1);
          }
          50% {
            transform: translate3d(0, -13px, 0) rotate(1deg) scale(1.025);
          }
        }

        .flying-book {
          z-index: 5;
          width: min(540px, 46vw);
          aspect-ratio: 1.28;
          filter:
            drop-shadow(0 30px 80px rgba(0,0,0,.6))
            drop-shadow(0 0 35px rgba(117, 55, 220, .18));
        }

        .flying-book::before {
          content: "";
          position: absolute;
          inset: -16%;
          z-index: -1;
          border-radius: 50%;
          background:
            conic-gradient(
              from 0deg,
              transparent,
              rgba(185, 125, 255, .18),
              transparent 22%,
              rgba(125, 70, 220, .15),
              transparent 48%,
              rgba(230, 193, 255, .16),
              transparent 72%
            );
          filter: blur(18px);
          animation: bookAura 9s linear infinite;
        }

        @keyframes bookAura {
          to { transform: rotate(360deg); }
        }

        .book-cover {
          overflow: hidden;
          border: 1px solid rgba(225, 193, 255, .55);
          background:
            radial-gradient(circle at 50% 35%, rgba(169, 112, 255, .22), transparent 28%),
            linear-gradient(135deg, #0e061b, #32115d 46%, #0a0413);
          box-shadow:
            0 35px 100px rgba(0,0,0,.62),
            inset 0 0 70px rgba(191, 129, 255, .10),
            inset 0 0 0 8px rgba(111, 57, 176, .10);
        }

        .book-cover::after {
          content: "✦";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 110px;
          height: 110px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(214, 178, 255, .22);
          border-radius: 50%;
          color: rgba(226, 199, 255, .62);
          font-family: Georgia, serif;
          font-size: 32px;
          box-shadow:
            0 0 40px rgba(139, 92, 246, .16),
            inset 0 0 30px rgba(139, 92, 246, .08);
          animation: coverSigil 3.5s ease-in-out infinite;
        }

        @keyframes coverSigil {
          0%, 100% { transform: translate(-50%, -50%) scale(.96) rotate(0deg); opacity: .55; }
          50% { transform: translate(-50%, -50%) scale(1.06) rotate(8deg); opacity: 1; }
        }

        .book-cover-title {
          z-index: 3;
          text-shadow: 0 2px 20px rgba(0,0,0,.6);
        }

        .book-cover-title strong {
          font-size: clamp(38px, 4vw, 52px);
        }

        .book {
          filter:
            drop-shadow(0 35px 75px rgba(0,0,0,.68))
            drop-shadow(0 0 45px rgba(126, 70, 220, .12));
        }

        .book-shell {
          background:
            linear-gradient(90deg, #0d0618, #321554 50%, #0c0515);
          box-shadow:
            inset 0 0 0 1px rgba(226, 198, 255, .22),
            inset 0 0 90px rgba(135, 66, 218, .12),
            0 0 70px rgba(102, 43, 173, .08);
        }

        .book-spread {
          background:
            linear-gradient(
              90deg,
              rgba(245, 232, 202, .95),
              rgba(255, 248, 226, .98) 49.5%,
              rgba(231, 210, 174, .95) 50%,
              rgba(250, 240, 215, .96)
            );
          box-shadow:
            inset 0 0 80px rgba(117, 67, 111, .13),
            0 0 0 1px rgba(106, 61, 102, .18);
        }

        .book-spread::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              transparent 47%,
              rgba(91, 50, 89, .08) 49.6%,
              rgba(255,255,255,.55) 50%,
              rgba(91, 50, 89, .08) 50.4%,
              transparent 53%
            ),
            radial-gradient(circle at 50% 50%, transparent 42%, rgba(91, 45, 93, .08));
          mix-blend-mode: multiply;
        }

        .book-page {
          background:
            radial-gradient(circle at 14% 13%, rgba(255,255,255,.72), transparent 24%),
            radial-gradient(circle at 84% 80%, rgba(150, 92, 231, .11), transparent 30%),
            radial-gradient(circle at 50% 50%, rgba(255, 245, 216, .68), transparent 62%),
            linear-gradient(135deg, rgba(249, 239, 216, .98), rgba(235, 219, 190, .94));
          box-shadow:
            inset 0 0 70px rgba(82, 42, 67, .10),
            inset 0 0 0 1px rgba(116, 75, 93, .08);
        }

        .book-page::after {
          content: "✧  ✦  ✧";
          position: absolute;
          left: 50%;
          bottom: 19px;
          transform: translateX(-50%);
          color: rgba(109, 65, 135, .28);
          font-family: Georgia, serif;
          font-size: 9px;
          letter-spacing: .5em;
          pointer-events: none;
        }

        .page-inner {
          animation: pageMaterialize .75s cubic-bezier(.16,1,.3,1) both;
        }

        @keyframes pageMaterialize {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(.985);
            filter: blur(3px);
          }
          55% {
            opacity: 1;
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .page-label {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding-left: 20px;
        }

        .page-label::before {
          content: "✦";
          position: absolute;
          left: 0;
          color: #8b5cf6;
          animation: labelSpark 2.4s ease-in-out infinite;
        }

        @keyframes labelSpark {
          0%, 100% { opacity: .35; transform: scale(.8) rotate(0); }
          50% { opacity: 1; transform: scale(1.2) rotate(45deg); }
        }

        .page-title {
          text-shadow: 0 4px 25px rgba(99, 57, 115, .12);
        }

        .page-magic-orbit {
          width: 250px;
          height: 250px;
          right: -80px;
          top: -80px;
          border-color: rgba(117, 68, 181, .28);
          box-shadow: 0 0 40px rgba(139, 92, 246, .08);
        }

        .page-magic-orbit::before,
        .page-magic-orbit::after {
          border-color: rgba(139, 92, 246, .20);
        }

        .page-magic-orbit span {
          width: 6px;
          height: 6px;
          background: #b57cff;
        }

        .book-dragon-layer {
          inset: 9px;
          z-index: 2;
          opacity: .92;
          mix-blend-mode: screen;
          filter:
            saturate(1.2)
            contrast(1.08)
            drop-shadow(0 0 25px rgba(139, 92, 246, .2));
        }

        .book-dragon-layer::after {
          content: "✦   ✧   ✦   ✧   ✦";
          position: absolute;
          left: 50%;
          top: 18px;
          transform: translateX(-50%);
          color: rgba(205, 165, 255, .26);
          font-size: 8px;
          letter-spacing: .55em;
          pointer-events: none;
          animation: bookRuneDrift 7s linear infinite;
        }

        @keyframes bookRuneDrift {
          0% { transform: translateX(-50%) rotate(0deg); opacity: .18; }
          50% { opacity: .55; }
          100% { transform: translateX(-50%) rotate(360deg); opacity: .18; }
        }

        .page-transition {
          overflow: visible;
        }

        .page-transition::before {
          content: "";
          position: absolute;
          inset: -8%;
          z-index: 4;
          background:
            radial-gradient(circle at center, rgba(207, 165, 255, .30), transparent 22%),
            conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(178, 111, 255, .30) 45deg,
              transparent 85deg,
              rgba(255, 224, 177, .24) 150deg,
              transparent 200deg,
              rgba(142, 84, 231, .22) 270deg,
              transparent 320deg
            );
          mix-blend-mode: screen;
          filter: blur(5px);
          animation: pageMagicBurst .85s ease-out both;
        }

        .page-transition::after {
          content: "✦  ✧  ✦  ✧  ✦";
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 5;
          transform: translate(-50%, -50%);
          color: rgba(255, 235, 205, .72);
          font-family: Georgia, serif;
          font-size: 13px;
          letter-spacing: .55em;
          text-shadow:
            0 0 12px rgba(184, 122, 255, .95),
            0 0 32px rgba(139, 92, 246, .6);
          animation: pageRunes .85s ease-out both;
        }

        @keyframes pageMagicBurst {
          0% { opacity: 0; transform: scale(.72) rotate(-10deg); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.12) rotate(12deg); }
        }

        @keyframes pageRunes {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(.35) rotate(-12deg);
            letter-spacing: .15em;
          }
          28% { opacity: 1; }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.35) rotate(12deg);
            letter-spacing: .8em;
          }
        }

        .flip-page {
          background:
            linear-gradient(
              105deg,
              rgba(255, 248, 225, .98) 0%,
              rgba(240, 222, 190, .98) 44%,
              rgba(177, 124, 229, .26) 51%,
              rgba(255, 245, 215, .98) 58%,
              rgba(229, 208, 174, .98) 100%
            );
          box-shadow:
            -18px 0 45px rgba(83, 37, 91, .22),
            18px 0 45px rgba(83, 37, 91, .14),
            inset 0 0 45px rgba(120, 71, 155, .12);
        }

        .flip-page::before {
          content: "";
          position: absolute;
          inset: 8%;
          border: 1px solid rgba(116, 68, 150, .14);
          box-shadow: inset 0 0 35px rgba(139, 92, 246, .08);
          background:
            radial-gradient(circle at 50% 50%, rgba(157, 99, 225, .12), transparent 48%);
        }

        .flip-page::after {
          content: "✦";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: rgba(122, 68, 167, .38);
          font-family: Georgia, serif;
          font-size: 32px;
          text-shadow: 0 0 22px rgba(139, 92, 246, .45);
          animation: flipStar .85s ease-out both;
        }

        @keyframes flipStar {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(.4) rotate(0); }
          35% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.8) rotate(90deg); }
        }

        .book-controls {
          background:
            linear-gradient(135deg, rgba(25, 10, 37, .88), rgba(11, 5, 20, .76));
          border-color: rgba(198, 157, 255, .28);
          box-shadow:
            0 12px 40px rgba(0,0,0,.45),
            0 0 28px rgba(139,92,246,.08);
        }

        .sound-button {
          border-color: rgba(198, 157, 255, .28);
          background:
            linear-gradient(135deg, rgba(25, 10, 37, .86), rgba(11, 5, 20, .72));
          box-shadow: 0 8px 30px rgba(0,0,0,.3);
        }

        .sound-button::before {
          content: "◉";
          margin-right: 7px;
          color: #c7a0ff;
          animation: soundPulse 1.8s ease-in-out infinite;
        }

        @keyframes soundPulse {
          0%, 100% { opacity: .4; }
          50% { opacity: 1; }
        }

        .experience::before {
          content: "";
          position: fixed;
          inset: 4%;
          z-index: -1;
          border: 1px solid rgba(190, 144, 255, .08);
          border-radius: 36px;
          pointer-events: none;
          box-shadow: inset 0 0 100px rgba(139, 92, 246, .05);
        }

        /* =================================================
           FINAL PHOTO CANVAS — PAGE 08
        ================================================= */

        .ending-final-canvas {
          position: relative;
          margin: 30px 0 12px;
          padding: 30px 22px 26px;
          overflow: hidden;
          border: 1px solid rgba(111, 67, 164, .18);
          border-radius: 18px;
          background:
            radial-gradient(circle at 50% 10%, rgba(151, 93, 205, .16), transparent 38%),
            linear-gradient(145deg, rgba(255, 250, 239, .94), rgba(236, 220, 198, .78));
          box-shadow:
            inset 0 0 45px rgba(111, 67, 164, .055),
            0 18px 42px rgba(55, 33, 22, .10);
          isolation: isolate;
          animation: finalCanvasReveal .95s cubic-bezier(.2,.8,.2,1) both;
        }

        .ending-final-canvas::before {
          content: '';
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(129, 82, 174, .13);
          border-radius: 13px;
          pointer-events: none;
        }

        .ending-final-canvas-glow {
          position: absolute;
          width: 240px;
          height: 240px;
          left: 50%;
          top: 20%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(135, 79, 186, .20), transparent 68%);
          filter: blur(8px);
          animation: finalCanvasGlow 4s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }

        .ending-final-photo-frame {
          position: relative;
          width: min(100%, 420px);
          margin: 0 auto;
          transform: rotate(-1.1deg);
          animation: finalPhotoFloat 5s ease-in-out infinite;
        }

        .ending-final-photo-inner {
          position: relative;
          padding: 9px 9px 28px;
          background: #fffaf1;
          border: 1px solid rgba(92, 62, 38, .20);
          box-shadow:
            0 16px 28px rgba(61, 38, 18, .17),
            inset 0 0 0 1px rgba(255,255,255,.7);
          overflow: hidden;
        }

        .ending-final-photo-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(115deg, rgba(255,255,255,.34), transparent 35%),
            radial-gradient(circle at 85% 15%, rgba(150, 91, 202, .10), transparent 30%);
          pointer-events: none;
          z-index: 2;
        }

        .ending-final-photo-inner img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          background: linear-gradient(135deg, #e8d5b2, #c9ab7d);
          filter: saturate(.92) contrast(.98);
          transition: transform .7s ease, filter .7s ease;
        }

        .ending-final-photo-inner:hover img {
          transform: scale(1.035);
          filter: saturate(1) contrast(1.02);
        }

        .ending-final-photo-inner.photo-missing img {
          display: none;
        }

        .ending-final-photo-fallback {
          display: none;
          min-height: 210px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 9px;
          background:
            radial-gradient(circle at center, rgba(129, 82, 174, .14), transparent 58%),
            #eee3d1;
          color: #70459a;
        }

        .ending-final-photo-inner.photo-missing .ending-final-photo-fallback {
          display: flex;
        }

        .ending-final-photo-fallback span {
          font-size: 30px;
          animation: finalStarPulse 2.4s ease-in-out infinite;
        }

        .ending-final-photo-fallback small {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .22em;
        }

        .ending-final-photo-corner {
          position: absolute;
          z-index: 4;
          color: rgba(111, 67, 164, .65);
          font-size: 14px;
          animation: finalCornerTwinkle 2.8s ease-in-out infinite;
        }

        .ending-final-photo-corner-a {
          left: 18px;
          top: 16px;
        }

        .ending-final-photo-corner-b {
          right: 18px;
          bottom: 18px;
          animation-delay: .8s;
        }

        .ending-final-photo-caption {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding-top: 11px;
          text-align: center;
        }

        .ending-final-photo-caption span {
          color: #8a6339;
          font-size: .57rem;
          font-weight: 800;
          letter-spacing: .18em;
        }

        .ending-final-photo-caption strong {
          color: #4b3020;
          font-family: Georgia, serif;
          font-size: .92rem;
          font-weight: 500;
        }

        .ending-final-message {
          position: relative;
          max-width: 570px;
          margin: 30px auto 0;
          text-align: center;
        }

        .ending-final-kicker {
          display: block;
          margin-bottom: 12px;
          color: #7546a0;
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .28em;
        }

        .ending-final-message p {
          margin: 0;
          color: #35223d;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(15px, 1.45vw, 18px);
          line-height: 1.85;
        }

        .ending-final-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 18px auto 9px;
          color: #8b5ab0;
        }

        .ending-final-divider i {
          display: block;
          width: min(110px, 24vw);
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(111, 67, 164, .42), transparent);
        }

        .ending-final-message > small {
          color: #806a59;
          font-family: Georgia, serif;
          font-size: .72rem;
          font-style: italic;
        }

        @keyframes finalCanvasReveal {
          from {
            opacity: 0;
            transform: translateY(24px) scale(.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes finalCanvasGlow {
          0%, 100% { opacity: .55; transform: translate(-50%, -50%) scale(.9); }
          50% { opacity: .95; transform: translate(-50%, -50%) scale(1.15); }
        }

        @keyframes finalPhotoFloat {
          0%, 100% { transform: rotate(-1.1deg) translateY(0); }
          50% { transform: rotate(.7deg) translateY(-6px); }
        }

        @keyframes finalStarPulse {
          0%, 100% { transform: scale(.92) rotate(0); opacity: .7; }
          50% { transform: scale(1.12) rotate(12deg); opacity: 1; }
        }

        @keyframes finalCornerTwinkle {
          0%, 100% { opacity: .38; transform: scale(.9) rotate(0); }
          50% { opacity: 1; transform: scale(1.15) rotate(10deg); }
        }

        /* =================================================
           PAGE 08 — PHOTO INSIDE THE BOOK
           The photo is intentionally part of the parchment
           page, not a separate floating canvas outside it.
        ================================================= */

        .ending-final-message {
          position: relative;
          z-index: 3;
          max-width: 520px;
          margin: 28px auto 0;
          padding: 0 6px;
          text-align: center;
        }

        .ending-final-kicker {
          display: block;
          margin-bottom: 12px;
          color: #7546a0;
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .28em;
        }

        .ending-final-message p {
          margin: 0;
          color: #35223d;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(14px, 1.35vw, 17px);
          line-height: 1.85;
        }

        .ending-final-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 17px auto 9px;
          color: #8b5ab0;
        }

        .ending-final-divider i {
          display: block;
          width: min(105px, 22vw);
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(111, 67, 164, .42),
            transparent
          );
        }

        .ending-final-message > small {
          color: #806a59;
          font-family: Georgia, serif;
          font-size: .72rem;
          font-style: italic;
        }

        .ending-photo-heading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 22px auto 2px;
          color: rgba(112,67,164,.72);
          text-align: center;
          pointer-events: none;
        }

        .ending-photo-heading small {
          font-family: Georgia, serif;
          font-size: .58rem;
          font-weight: 800;
          letter-spacing: .22em;
        }

        .ending-photo-heading span {
          font-size: .7rem;
          animation: endingPhotoSpark 2.4s ease-in-out infinite;
        }

        .ending-photo-heading span:last-child {
          animation-delay: .8s;
        }

        .ending-book-photo {
          position: relative;
          z-index: 3;
          width: min(88%, 310px);
          margin: 28px auto 8px;
          transform: rotate(-1.7deg);
          animation: endingBookPhotoFloat 5.5s ease-in-out infinite;
        }

        .ending-book-photo-paper {
          position: relative;
          padding: 8px 8px 18px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 252, 241, .98),
              rgba(241, 226, 199, .96)
            );
          border: 1px solid rgba(105, 69, 44, .25);
          box-shadow:
            0 10px 20px rgba(62, 38, 16, .14),
            inset 0 0 0 1px rgba(255,255,255,.65);
        }

        .ending-book-photo-paper::before {
          content: "";
          position: absolute;
          inset: 5px;
          border: 1px solid rgba(126, 83, 48, .12);
          pointer-events: none;
        }

        .ending-book-photo-image {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          background:
            radial-gradient(
              circle at center,
              rgba(139, 92, 246, .16),
              transparent 65%
            ),
            #e8d6b5;
        }

        .ending-book-photo-image::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              120deg,
              rgba(255,255,255,.28),
              transparent 34%
            ),
            radial-gradient(
              circle at 80% 15%,
              rgba(164, 105, 220, .16),
              transparent 30%
            );
          mix-blend-mode: screen;
        }

        .ending-book-photo-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(.92) contrast(.98);
          transition: transform .8s ease, filter .8s ease;
        }

        .ending-book-photo:hover .ending-book-photo-image img {
          transform: scale(1.045);
          filter: saturate(1) contrast(1.03);
        }

        .ending-book-photo-image.photo-missing img {
          display: none;
        }

        .ending-book-photo-fallback {
          display: none;
          position: absolute;
          inset: 0;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          color: #70459a;
        }

        .ending-book-photo-image.photo-missing .ending-book-photo-fallback {
          display: flex;
        }

        .ending-book-photo-fallback span {
          font-size: 28px;
          animation: endingPhotoSpark 2s ease-in-out infinite;
        }

        .ending-book-photo-fallback small {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .2em;
        }

        .ending-book-photo-spark {
          position: absolute;
          z-index: 4;
          color: rgba(111, 67, 164, .78);
          text-shadow: 0 0 12px rgba(151, 91, 214, .45);
          pointer-events: none;
          animation: endingPhotoSpark 2.6s ease-in-out infinite;
        }

        .ending-book-photo-spark.spark-a {
          top: 12px;
          left: 14px;
        }

        .ending-book-photo-spark.spark-b {
          right: 15px;
          top: 24px;
          animation-delay: .8s;
        }

        .ending-book-photo-spark.spark-c {
          left: 23px;
          bottom: 20px;
          animation-delay: 1.3s;
        }

        .ending-book-photo figcaption {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding-top: 10px;
          text-align: center;
        }

        .ending-book-photo figcaption span {
          color: #8a6339;
          font-size: .52rem;
          font-weight: 900;
          letter-spacing: .19em;
        }

        .ending-book-photo figcaption strong {
          color: #4b3020;
          font-family: Georgia, serif;
          font-size: .82rem;
          font-weight: 500;
        }

        @keyframes endingBookPhotoFloat {
          0%, 100% {
            transform: rotate(-1.7deg) translateY(0);
          }
          50% {
            transform: rotate(.9deg) translateY(-5px);
          }
        }

        @keyframes endingPhotoSpark {
          0%, 100% {
            opacity: .35;
            transform: scale(.9) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.16) rotate(10deg);
          }
        }

        @media (max-width: 680px) {
          .ending-final-message {
            margin-top: 22px;
          }

          .ending-final-message p {
            font-size: 14px;
            line-height: 1.75;
          }

          .ending-book-photo {
            width: min(92%, 270px);
            margin-top: 23px;
          }

          .ending-book-photo-paper {
            padding: 6px 6px 15px;
          }

          .ending-book-photo figcaption strong {
            font-size: .76rem;
          }
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        .ending-memory-gallery {
          position: relative;
          margin: 28px 0 8px;
          padding: 24px 18px 18px;
          border: 1px solid rgba(123, 75, 39, .24);
          border-radius: 14px;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(214, 164, 91, .18), transparent 58%),
            linear-gradient(145deg, rgba(255, 248, 226, .72), rgba(229, 205, 163, .46));
          box-shadow: inset 0 0 28px rgba(117, 75, 35, .07), 0 12px 30px rgba(58, 32, 12, .08);
          overflow: hidden;
        }

        .ending-gallery-heading { text-align: center; margin-bottom: 18px; }
        .ending-gallery-heading > span { color: #8a6339; font-size: .62rem; letter-spacing: .2em; font-weight: 800; }
        .ending-gallery-heading h3 { margin: 7px 0 5px; color: #4b3020; font-family: Georgia, serif; font-size: clamp(1.15rem, 2.8vw, 1.7rem); font-weight: 500; }
        .ending-gallery-heading p { margin: 0; color: #745a43; font-size: .78rem; line-height: 1.6; }
        .ending-gallery-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px; align-items: start; }
        .ending-memory-card { margin: 0; min-width: 0; transform: rotate(-1.6deg); transition: transform .45s ease, filter .45s ease; animation: memoryReveal .8s both; }
        .ending-memory-card:nth-child(even) { transform: translateY(12px) rotate(1.8deg); animation-delay: .12s; }
        .ending-memory-card:nth-child(3) { transform: translateY(-3px) rotate(1.2deg); animation-delay: .22s; }
        .ending-memory-card:hover { transform: translateY(-5px) rotate(0) scale(1.025); filter: drop-shadow(0 10px 12px rgba(69, 43, 19, .18)); z-index: 2; }
        .ending-memory-frame { position: relative; padding: 7px 7px 18px; background: #fffaf0; border: 1px solid rgba(111, 77, 45, .22); box-shadow: 0 5px 14px rgba(62, 38, 16, .14); }
        .ending-memory-frame::after { content: '✦'; position: absolute; right: 10px; bottom: 3px; color: #ad8853; font-size: 10px; }
        .ending-memory-frame img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: linear-gradient(135deg, #e9d8b8, #c8ad82); }
        .ending-memory-card figcaption { padding: 9px 3px 0; text-align: center; color: #745537; font-size: .59rem; font-weight: 800; letter-spacing: .11em; }
        .ending-memory-card.image-unavailable .ending-memory-frame img { display: none; }
        .ending-memory-card.image-unavailable .ending-memory-frame { min-height: 95px; background: radial-gradient(circle, rgba(186, 145, 82, .25), transparent 60%), #f5e8cf; }
        .ending-gallery-signoff { margin: 23px 0 0; text-align: center; color: #876344; font-family: Georgia, serif; font-size: .82rem; font-style: italic; }
        @keyframes memoryReveal { from { opacity: 0; transform: translateY(18px) rotate(0); } to { opacity: 1; } }

        
        @media (max-width: 680px) {
          .ending-final-canvas {
            margin-top: 22px;
            padding: 24px 13px 22px;
            border-radius: 14px;
          }

          .ending-final-photo-frame {
            width: min(100%, 340px);
          }

          .ending-final-photo-inner {
            padding: 7px 7px 22px;
          }

          .ending-final-photo-caption strong {
            font-size: .82rem;
          }

          .ending-final-message {
            margin-top: 24px;
          }

          .ending-final-message p {
            font-size: 14px;
            line-height: 1.75;
          }
        }

@media (max-width: 680px) {
          .ending-memory-gallery { padding: 18px 12px 14px; }
          .ending-gallery-grid { gap: 10px; }
          .ending-memory-frame { padding: 5px 5px 15px; }
          .ending-memory-card figcaption { font-size: .52rem; letter-spacing: .07em; }
          .intro-dragon-orbit { inset: -4% -10%; opacity: .9; }

          max-width: 900px
        ) {
          .intro-content {
            grid-template-columns:
              1fr;
            gap: 25px;
            text-align: center;
          }

          .intro-copy {
            padding-left: 0;
            order: 2;
          }

          .flying-book {
            width:
              min(
                430px,
                82vw
              );
            margin: 0 auto;
          }

          .intro-dragon {
            inset: -12% -18%;
          }

          .intro-content h1 {
            font-size:
              clamp(
                52px,
                13vw,
                82px
              );
          }

          .intro-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .experience {
            padding:
              20px
              14px
              100px;
          }

          .book-wrapper {
            width: 96vw;
            height:
              min(
                760px,
                76vh
              );
            min-height: 540px;
          }

          .page-inner {
            padding:
              38px 34px;
          }
        }

        @media (
          max-width: 680px
        ) {
          .intro-content {
            width: 92vw;
          }

          .flying-book {
            width: 330px;
          }

          .intro-dragon {
            inset: -10% -14%;
          }

          .book-wrapper {
            height:
              72vh;
            min-height: 500px;
          }

          .book-spread {
            grid-template-columns:
              1fr;
          }

          .book-page.left {
            display: none;
          }

          .book-page.right {
            border-left: 0;
          }

          .page-inner {
            padding:
              34px 27px
              45px;
          }

          .page-title {
            font-size: 31px;
          }

          .page-text {
            font-size: 15px;
            line-height: 1.78;
          }

          .memory-grid {
            grid-template-columns:
              1fr;
            gap: 15px;
          }

          .section-memory {
            margin-top: 18px;
          }

          .section-memory .memory-photo {
            min-height: 130px;
          }

          .memory-photo {
            min-height: 150px;
          }

          .memory-photo:nth-child(
            even
          ) {
            transform:
              rotate(2deg);
          }

          .book-controls {
            bottom: 14px;
          }

          .sound-button {
            top: 14px;
            right: 14px;
          }

          .made-by {
            display: none;
          }

          .dragon-page-copy {
            left: 25px;
            bottom: 25px;
            max-width: 180px;
          }

          .dragon-page-copy h2 {
            font-size: 25px;
          }
        }

        @media (
          max-height: 700px
        ) and (
          min-width: 681px
        ) {
          .book-wrapper {
            height: 78vh;
            min-height: 500px;
          }

          .page-inner {
            padding:
              32px 40px;
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          *,
          *::before,
          *::after {
            animation-duration:
              .001ms !important;
            animation-iteration-count:
              1 !important;
            scroll-behavior:
              auto !important;
          }
        }

        /* =================================================
           MOBILE — ONE PHYSICAL PAGE AT A TIME
           The desktop spread becomes a portrait book page.
           Swipe left/right or use the controls to turn pages.
        ================================================= */

        @media (max-width: 680px) {
          html,
          body,
          #root {
            width: 100%;
            min-height: 100%;
            overflow-x: hidden;
          }

          .bayu-experience {
            min-height: 100svh;
            height: 100svh;
            overflow: hidden;
            touch-action: pan-y;
          }

          .world-canvas {
            position: fixed;
            inset: 0;
          }

          .experience {
            width: 100%;
            min-height: 100svh;
            height: 100svh;
            padding: 58px 12px 92px;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .experience::before {
            inset: 2.5%;
            border-radius: 24px;
          }

          .book-wrapper {
            width: min(94vw, 470px);
            height: min(78svh, 720px);
            min-height: 0;
            max-height: calc(100svh - 155px);
            perspective: 1800px;
          }

          .book {
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }

          .book-shell {
            border-radius: 9px;
          }

          .book-spread {
            inset: 9px;
            display: block;
            overflow: hidden;
            border-radius: 5px;
            background: #f7ead0;
          }

          .book-spread::before {
            display: none;
          }

          .book-page {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            display: none;
            border: 0 !important;
          }

          .book-spread.mobile-left-active .book-page.left,
          .book-spread.mobile-right-active .book-page.right {
            display: block;
            animation: mobilePageAppear .48s cubic-bezier(.16,1,.3,1) both;
          }

          @keyframes mobilePageAppear {
            from {
              opacity: 0;
              transform: translateX(18px) scale(.985);
              filter: blur(2px);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
              filter: blur(0);
            }
          }

          .book-page.left .page-no,
          .book-page.right .page-no {
            left: auto;
            right: 20px;
            bottom: 14px;
          }

          .page-inner {
            height: 100%;
            padding: 34px 25px 58px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }

          .page-inner::-webkit-scrollbar {
            width: 3px;
          }

          .page-label {
            margin-bottom: 11px;
            font-size: 8px;
            letter-spacing: .22em;
          }

          .page-title {
            margin-bottom: 20px;
            font-size: clamp(28px, 8vw, 40px);
            line-height: 1.03;
          }

          .page-text {
            font-size: 15px;
            line-height: 1.82;
          }

          .page-text + .page-text {
            margin-top: 21px;
          }

          .quote-mark {
            right: 18px;
            top: 18px;
            font-size: 82px;
          }

          .section-memory {
            margin: 20px 0 7px;
          }

          .section-memory .memory-photo {
            width: min(100%, 360px);
            min-height: 165px;
          }

          .memory-photo {
            min-height: 150px;
            border-width: 6px;
          }

          .memory-photo img {
            min-height: 150px;
          }

          .memory-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .bracelet-wrap {
            min-height: 260px;
            margin-top: 8px;
          }

          .bracelet-wrap img {
            min-height: 260px;
          }

          .bracelet-note {
            font-size: 12px;
            line-height: 1.75;
          }

          .letter-page {
            justify-content: flex-start;
          }

          .letter-highlight {
            margin: 20px 0;
            padding: 19px 18px 19px 20px;
          }

          .ending-page {
            min-height: 100%;
            padding: 25px 0 45px;
            justify-content: center;
          }

          .ending-symbol {
            width: 88px;
            height: 88px;
            margin-bottom: 24px;
            font-size: 28px;
          }

          .ending-page h2 {
            font-size: clamp(34px, 9vw, 48px);
          }

          .dragon-page {
            min-height: 100%;
          }

          .dragon-page .dragon-canvas {
            height: 210px;
            min-height: 210px;
            flex-basis: 210px;
          }

          .dragon-page .dragon-page-copy {
            padding: 10px 23px 42px;
          }

          .dragon-page .dragon-page-copy > h2 {
            font-size: 31px;
          }

          .dragon-page .ending-letter {
            max-height: none;
            overflow: visible;
            margin-top: 16px;
          }

          .dragon-page .ending-letter p {
            font-size: 13px;
            line-height: 1.8;
          }

          .ending-final-message {
            margin-top: 22px;
          }

          .ending-book-photo {
            width: min(94%, 290px);
          }

          .book-dragon-layer {
            inset: 7px;
            opacity: .5;
          }

          .book-dragon-layer canvas {
            opacity: .75;
          }

          .page-transition {
            inset: 9px;
            overflow: hidden;
          }

          .flip-page {
            width: 100%;
            left: 0 !important;
            right: auto !important;
            transform-origin: center center !important;
          }

          .flip-page.forward {
            animation-name: mobileFlipForward;
          }

          .flip-page.backward {
            animation-name: mobileFlipBackward;
          }

          @keyframes mobileFlipForward {
            0% {
              transform: rotateY(0deg) scaleX(1);
              opacity: 1;
            }
            55% {
              transform: rotateY(-90deg) scaleX(.98);
              opacity: .96;
            }
            100% {
              transform: rotateY(-180deg) scaleX(1);
              opacity: 0;
            }
          }

          @keyframes mobileFlipBackward {
            0% {
              transform: rotateY(0deg) scaleX(1);
              opacity: 1;
            }
            55% {
              transform: rotateY(90deg) scaleX(.98);
              opacity: .96;
            }
            100% {
              transform: rotateY(180deg) scaleX(1);
              opacity: 0;
            }
          }

          .book-controls {
            bottom: max(14px, env(safe-area-inset-bottom));
            gap: 9px;
            padding: 7px 9px;
          }

          .book-controls button {
            width: 42px;
            height: 42px;
            font-size: 16px;
          }

          .book-counter {
            min-width: 74px;
            font-size: 9px;
          }

          .sound-button {
            top: max(12px, env(safe-area-inset-top));
            right: 12px;
            padding: 8px 11px;
            font-size: 8px;
          }

          .made-by {
            display: none;
          }

          .intro-screen {
            padding: max(22px, env(safe-area-inset-top)) 18px max(25px, env(safe-area-inset-bottom));
          }

          .intro-content {
            width: 100%;
            min-height: 100svh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 4px;
            text-align: center;
          }

          .flying-book {
            order: 1;
            width: min(78vw, 340px);
            margin: -5px auto 0;
          }

          .intro-copy {
            order: 2;
            padding: 0;
            margin-top: -4px;
          }

          .intro-eyebrow {
            margin-bottom: 12px;
            font-size: 9px;
            letter-spacing: .28em;
          }

          .intro-content h1 {
            font-size: clamp(48px, 15vw, 72px);
          }

          .intro-subtitle {
            max-width: 310px;
            margin: 18px auto 0;
            font-size: 14px;
            line-height: 1.7;
          }

          .enter-button {
            margin-top: 23px;
            padding: 13px 20px;
            font-size: 10px;
          }

          .intro-dragon {
            inset: -5% -18%;
            opacity: .78;
          }

          .intro-screen::before {
            inset: 3%;
            border-radius: 24px;
          }
        }
        `}
      </style>

      {/* ===================================================
          3D WORLD
      =================================================== */}

      <div className="world-canvas">
        <Canvas
          camera={{
            position: [
              0,
              0,
              8,
            ],
            fov: 42,
            near: 0.01,
            far: 1000,
          }}
          dpr={[
            1,
            1.5,
          ]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference:
              'high-performance',
          }}
        >
          <World />
        </Canvas>
      </div>

      <div className="atmosphere" />

      <div className="storm-glow" />

      <FloatingEmbers />

      {/* ===================================================
          INTRO
      =================================================== */}

      {!started && (
        <div
          className="intro-screen"
          style={{ pointerEvents: 'auto' }}
          onPointerDown={startBackgroundMusic}
        >
          <div className="intro-stars" />

          {/* Dragon stays in the intro scene from the first render,
              independent from the floating book so it is never hidden behind it. */}
          <div
            className="intro-dragon intro-dragon-orbit"
            aria-hidden="true"
            style={{ pointerEvents: 'none' }}
          >
            <Canvas
              camera={{ position: [0, 0.15, 7.2], fov: 38, near: 0.01, far: 100 }}
              dpr={[1, 1.35]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              style={{ pointerEvents: 'none' }}
            >
              <BookDragonWorld />
            </Canvas>
          </div>

          <div className="intro-content">
            <div className="intro-copy">
              <p className="intro-eyebrow">
                39LETTERS · 02
              </p>

              <h1>
                For Bayu.
              </h1>

              <p className="intro-subtitle">
                A story about friendship,
                time, memories, and a
                dragon that guards the
                pages we once lived.
              </p>

              <button
                className="enter-button"
                onClick={
                  openBook
                }
              >
                Open the memory
              </button>
            </div>

            <div className="flying-book">
              <div className="book-shadow" />

              <div className="book-cover">
                <div className="book-cover-title">
                  <span>
                    A MEMORY
                    BOOK
                  </span>

                  <strong>
                    Bayu
                  </strong>

                  <small>
                    A STORY
                    WORTH
                    KEEPING
                  </small>
                </div>
              </div>

              <div className="book-spine" />
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          BOOK EXPERIENCE
      =================================================== */}

      {started && (
        <div
          className="experience"
          onTouchStart={
            handleTouchStart
          }
          onTouchEnd={
            handleTouchEnd
          }
        >
          <div
            ref={bookRef}
            className="book-wrapper"
          >
            <div className="book">
              {/* THE DRAGON LIVES INSIDE THE OPEN BOOK */}
              <div className="book-dragon-layer" aria-hidden="true">
                <Canvas
                  camera={{
                    position: [0, 0.15, 6.4],
                    fov: 38,
                    near: 0.01,
                    far: 100,
                  }}
                  dpr={[1, 1.25]}
                  gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                  }}
                >
                  <BookDragonWorld />
                </Canvas>
              </div>

              <div className="book-shell" />

              <div
                className={`book-spread ${
                  isMobile
                    ? mobileSide === 0
                      ? 'mobile-left-active'
                      : 'mobile-right-active'
                    : ''
                }`}
              >
                {/* =========================================
                    LEFT PAGE
                ========================================= */}

                <BookPage
                  key={`left-page-${page}`}
                  side="left"
                  pageNumber={
                    pages[
                      page
                    ]
                      ?.number ??
                    '01'
                  }
                >
                  {page === 0 && (
                    <>
                      <div className="page-magic-orbit" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>

                      <p className="page-label">
                        THE QUESTION
                      </p>

                      <h2 className="page-title opening-title">
                        Apa arti teman yang sesungguhnya?
                      </h2>

                      <p className="page-text opening-story">
                        Bayu, apa arti teman yang sesungguhnya? Aku selalu bertanya-tanya, apa arti dari teman yang sebenarnya. Orang yang mengenal kita? Orang yang bertemu dengan kita? Orang yang bisa saling membantu, tapi juga saling membenci? Orang yang cukup tahu? Orang yang berdiri di samping kita? Yang mana yang benar? Kuharap kamu bisa menyimak ini.
                      </p>

                      <div className="opening-signature">
                        <span>for Bayu</span>
                        <i>✦</i>
                      </div>

                      <div className="page-line" />

                      <div className="page-line" />

                      <h1 className="page-title">
                        Berchmans
                        Bayu
                        <br />
                        bin Jaya
                      </h1>

                      <p className="page-text">Bayu</p>
                      <SectionPhoto index={0} />
                      <div className="page-orb" />
                    </>
                  )}

                  {page === 1 && (
                    <>
                      <p className="page-label">
                        FIRST IMPRESSION
                      </p>

                      <h2 className="page-title">
                        What I thought
                        of you.
                      </h2>

                      <p className="page-text">
                        {letterText.firstImpression}
                      </p>

                      <SectionPhoto index={8} />
                    </>
                  )}

                  {page === 2 && (
                    <>
                      <p className="page-label">
                        THE LITTLE
                        THINGS
                      </p>

                      <h2 className="page-title">
                        The things
                        I will
                        remember.
                      </h2>

                      <p className="page-text">
                        {letterText.habits}
                      </p>
                      <SectionPhoto index={2} />

                      <div className="section-copy">
                        <p className="page-text">{letterText.random}</p>
                        <SectionPhoto index={3} />
                      </div>

                      <div className="section-copy">
                        <p className="page-text">{letterText.impressed}</p>
                        <SectionPhoto index={4} />
                      </div>
                    </>
                  )}

                  {page === 3 && (
                    <>
                      <p className="page-label">
                        OUR
                        JOURNEY
                      </p>

                      <h2 className="page-title">
                        Some memories
                        don't need
                        explanations.
                      </h2>

                      <p className="page-text">
                        {letterText.difficultTimes}
                      </p>

                      <SectionPhoto index={5} />
                    </>
                  )}

                  {page === 4 && (
                    <>
                      <p className="page-label">
                        MORE THAN
                        A FRIEND
                      </p>

                      <h2 className="page-title">
                        Somewhere
                        along the
                        way.
                      </h2>

                      <p className="page-text">{letterText.family}</p>
                      <SectionPhoto index={10} />
                    </>
                  )}

                  {page === 5 && (
                    <>
                      <p className="page-label">
                        SOMETHING I NEVER SAY
                      </p>

                      <h2 className="page-title">
                        A part of me you may not know.
                      </h2>

                      <p className="page-text">{letterText.whatHeKnows}</p>
                      <SectionPhoto index={12} />
                    </>
                  )}

                  {page === 6 && (
                    <>
                      <p className="page-label">THE MESSAGE</p>
                      <h2 className="page-title">For wherever life takes you.</h2>

                      <div className="section-copy">
                        <p className="page-text">{letterText.messageIntro}</p>
                        <SectionPhoto index={14} />
                      </div>

                      <div className="section-copy">
                        <p className="page-text">{letterText.messageDreams}</p>
                        <SectionPhoto index={15} />
                      </div>
                    </>
                  )}

                  {page === 7 && (
                    <div className="ending-page">
                      <div className="ending-symbol">✦</div>
                      <h2>This is not the end.</h2>
                      <SectionPhoto index={19} />
                    </div>
                  )}
                </BookPage>

                {/* =========================================
                    RIGHT PAGE
                ========================================= */}

                <BookPage
                  key={`right-page-${page}`}
                  side="right"
                  pageNumber={
                    String(
                      page + 1,
                    ).padStart(
                      2,
                      '0',
                    )
                  }
                >
                  {page === 0 && (
                    <>
                      <p className="page-label">THE BEGINNING</p>
                      <h2 className="page-title">The day we met.</h2>
                      <p className="page-text">{letterText.beginning}</p>
                      <SectionPhoto index={1} />
                    </>
                  )}

                  {page === 1 && (
                    <>
                      <p className="page-label">
                        OUR FRIENDSHIP
                      </p>

                      <h2 className="page-title">
                        Somehow, we stayed.
                      </h2>

                      <div className="letter-highlight">
                        <p className="page-text">{letterText.friendship}</p>
                      </div>
                      <SectionPhoto index={6} />
                    </>
                  )}

                  {page === 2 && (
                    <>
                      <p className="page-label">A MEMORY IN BETWEEN</p>
                      <h2 className="page-title">Some moments are simply remembered.</h2>
                      <SectionPhoto index={7} />
                    </>
                  )}

                  {page === 3 && (
                    <>
                      <p className="page-label">GRATITUDE</p>
                      <h2 className="page-title">One of the things I am grateful for.</h2>
                      <p className="page-text">{letterText.gratitude}</p>
                      <SectionPhoto index={9} />
                    </>
                  )}

                  {page === 4 && (
                    <>
                      <p className="page-label">THE FEAR</p>
                      <h2 className="page-title">Some distances are scary.</h2>
                      <p className="page-text">{letterText.fear}</p>
                      <SectionPhoto index={11} />
                    </>
                  )}

                  {page === 5 && (
                    <>
                      <p className="page-label">A SMALL PAUSE</p>
                      <h2 className="page-title">Before the last words.</h2>
                      <SectionPhoto index={13} />
                    </>
                  )}

                  {page === 6 && (
                    <>
                      <p className="page-label">
                        THE
                        SYMBOL
                      </p>

                      <h2 className="page-title">
                        The bracelet.
                      </h2>

                      <div className="bracelet-wrap">
                        <img
                          src={PHOTO_PATH(PHOTO_FILES.bracelet)}
                          alt="Gelang kenangan"
                          onError={(
                            event,
                          ) => {
                            event.currentTarget.style.display =
                              'none'
                          }}
                        />

                        <div className="bracelet-placeholder">
                          <strong>
                            ✦
                          </strong>

                          <span>
                            GELANG
                            KENANGAN
                          </span>
                        </div>
                      </div>

                      <p className="bracelet-note">{letterText.braceletMessage}</p>
                      <div className="section-copy">
                        <p className="page-text">{letterText.successMessage}</p>
                        <SectionPhoto index={18} />
                      </div>

                      </>
                  )}

                  {page === 7 && (
                    <div className="dragon-page">
                      <div className="dragon-canvas">
                        <Canvas
                          camera={{
                            position: [
                              0,
                              0.1,
                              7,
                            ],
                            fov: 40,
                            near: 0.01,
                            far: 100,
                          }}
                          dpr={[
                            1,
                            1.35,
                          ]}
                          gl={{
                            antialias:
                              true,
                            alpha:
                              true,
                            powerPreference:
                              'high-performance',
                          }}
                        >
                          <World />
                        </Canvas>
                      </div>

                      <SectionPhoto index={21} />

                      <div className="dragon-page-copy">
                        <p className="page-label">
                          UNTIL WE
                          MEET AGAIN
                        </p>

                        <h2>
                          Keep flying,
                          Bayu.
                        </h2>

                        <div className="ending-letter">
                          <p>Bagiku, teman bukanlah sekadar kata yang menyatakan sebatas hubungan biasa. Dengan kita menyebut seseorang sebagai teman, berarti kita sudah menaruh kepercayaan pada mereka. Apalagi saat status teman sudah berkembang menjadi sahabat, bahkan keluarga. Bukan hanya percaya, mungkin rasanya bisa melebihi hal itu.</p>

                          <p>Dari sudut pandangku, kamu salah satu simbol dari pertemanan itu. Menurutku, kamu cukup menggambarkan apa itu arti dari “kesetiaan”. Sikap dan kepribadianmu sendiri sudah membuktikannya. Dengan kita berteman selama ini, kesetiaan itu buktinya. Kesetiaan bukan hanya menggambarkan hubungan antara pasangan, tapi banyak hal. Dalam dunia ini, semua hubungan memiliki unsur itu, dan bagiku kamu layak mendapat sebutan itu. Jadilah dirimu sendiri terus dan berusahalah menjadi yang terbaik nanti. Aku akan melihat dan menunggu setiap prosesmu sebagaimana kita biasanya saling berbagi proses. Semangat terus, saudaraku, dan SAMPAI JUMPA.</p>
                        </div>

                        <div className="ending-final-message">
                          <span className="ending-final-kicker">THIS IS NOT THE END.</span>
                          <p>{letterText.finalMessage}</p>

                          <div className="ending-final-divider">
                            <span>✦</span>
                            <i />
                            <span>✦</span>
                          </div>

                          <small>Until our paths cross again.</small>
                        </div>

                        <div className="ending-photo-heading">
                          <span>✦</span>
                          <small>ONE LAST MEMORY</small>
                          <span>✦</span>
                        </div>

                        <figure className="ending-book-photo" aria-label="One last memory">
                          <div className="ending-book-photo-paper">
                            <div className="ending-book-photo-image">
                              <img
                                src={PHOTO_PATH(PHOTO_FILES.memory22)}
                                alt="A memory of Bayu"
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.style.display = 'none'
                                  event.currentTarget.parentElement?.classList.add('photo-missing')
                                }}
                              />

                              <div className="ending-book-photo-fallback">
                                <span>✦</span>
                                <small>ONE MORE MEMORY</small>
                              </div>

                              <span className="ending-book-photo-spark spark-a">✦</span>
                              <span className="ending-book-photo-spark spark-b">✧</span>
                              <span className="ending-book-photo-spark spark-c">·</span>
                            </div>

                            <figcaption>
                              <span>08 · UNTIL AGAIN</span>
                              <strong>Some memories deserve one more page.</strong>
                            </figcaption>
                          </div>
                        </figure>
                      </div>
                    </div>
                  )}
                </BookPage>
              </div>

              {/* =========================================
                  PAGE FLIP OVERLAY
              ========================================= */}

              {flipping && (
                <div
                  className="page-transition"
                  key={`flip-${page}-${flipping}`}
                >
                  <div
                    className={`flip-page ${flipDirection}`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              CONTROLS
          ================================================= */}

          <div className="book-controls">
            <button
              type="button"
              onClick={
                previousPage
              }
              disabled={
                flipping ||
                (isMobile
                  ? page * 2 + mobileSide <= 0
                  : page === 0)
              }
              aria-label="Previous page"
            >
              ←
            </button>

            <div className="book-counter">
              {String(
                isMobile
                  ? page * 2 + mobileSide + 1
                  : page + 1,
              ).padStart(
                2,
                '0',
              )}
              {' / '}
              {String(
                isMobile
                  ? pages.length * 2
                  : pages.length,
              ).padStart(
                2,
                '0',
              )}
            </div>

            <button
              type="button"
              onClick={
                nextPage
              }
              disabled={
                flipping ||
                (isMobile
                  ? page * 2 + mobileSide >= pages.length * 2 - 1
                  : page === pages.length - 1)
              }
              aria-label="Next page"
            >
              →
            </button>
          </div>

          <button
            type="button"
            className="sound-button"
            onClick={() => {
              if (sound) {
                setSound(false)

                if (musicRef.current) {
                  musicRef.current.pause()
                }
              } else {
                setSound(true)

                startBackgroundMusic()
              }
            }}
          >
            {sound
              ? 'Sound on'
              : 'Sound off'}
          </button>

          <div className="made-by">
            Made with memories ·
            39Production
          </div>
        </div>
      )}
    </main>
  )
}

/* =========================================================
   PRELOAD
========================================================= */

useGLTF.preload(
  DRAGON_PATH,
)

/* =========================================================
   DEFAULT
========================================================= */

export default BayuExperience