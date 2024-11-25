import { TipeDokumen } from './src/models/enums/tipeDokumen';
import { createHmac, createHash } from 'crypto';
import { v4 as uuidV4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function getRandomPejabat(pejabatList) {
  return pejabatList[Math.floor(Math.random() * pejabatList.length)].id;
}

function getRandomTembusan(tembusanList, count = 3) {
  // Shuffle the list and pick `count` random tembusan
  const shuffled = tembusanList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(t => ({ id: t.id }));
}

const roles = [
  { id: "c6575a11-dc48-45a3-8818-60d45c865938", name: "Direktur" },
  { id: "5659845c-3af8-427d-9217-416576c0b56d", name: "SuperAdmin" },
  { id: "f8c46b8c-36bc-4e82-b2ab-2d90b4e7e6e2", name: "KabSubdit Registrasi" },
  { id: "54ae0f14-0b52-4904-951b-6b4b2d1b2437", name: "KabSubdit Rekomendasi" },
  { id: "6b2cbb77-bc78-4d41-9f2f-56d071b4d2e3", name: "PIC Registrasi" },
  { id: "d0843b92-60fc-48e7-baf2-03d2cc5f1762", name: "PIC Rekomendasi" },
  { id: "4f8c2d65-1c35-4b6d-80fc-2a7891ab8b8d", name: "PIC Notifikasi" },
  { id: "9e7e5a89-8496-49cd-b7a8-d85c3c3e0485", name: "PIC Pelaporan" },
  { id: "85a9e912-8f7b-41e5-95b1-67a2af4cc2a5", name: "PIC CMS" },
  { id: "a6ff2d5c-aa09-4951-ad53-e52f7efdfbd1", name: "Pengelola" },
];

function generateUniqueSlug(title) {
  const timestamp = Date.now(); // Generate a unique timestamp
  return `${title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;
}
async function insertRoles(prisma) {
  try {
    for (const role of roles) {
      await prisma.roles.create({
        data: {
          id: role.id,
          name: role.name,
        },
      });
    }
    console.log("Roles inserted successfully!");
  } catch (error) {
    console.error("Error inserting roles:", error);
  }
}

async function createSuperAdminUser(prisma) {
  const password = 'superadmin123'; // Ganti dengan password aktual
  const idNumber = '123456789'; // Ganti dengan nomor identitas pengguna
  const provinces = await prisma.province.findFirst();
  const regencies = await prisma.regencies.findFirst( {where:{
    provinceId: provinces.id
  }});
  const districts = await prisma.districts.findMany();
  const villages = await prisma.village.findMany();
  // Buat salt
  const salt = uuidV4();

  // Hash password dengan salt
  const hashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

  // Hash nomor identitas (opsional, jika dibutuhkan)
  const hashedKTP = createHash('sha256').update(idNumber).digest('hex');

  try {
    const superAdminRole = await prisma.roles.findUnique({
      where: { name: 'SuperAdmin' },
    });

    if (!superAdminRole) {
      throw new Error('Role SuperAdmin tidak ditemukan');
    }

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        id: uuidV4(), // Gunakan UUID untuk user ID
        fullName: 'Super Admin',
        email: 'superadmin@example.com',
        password: hashedPassword, // Simpan password yang sudah di-hash
        salt, // Simpan salt untuk verifikasi password di masa depan
        phoneNumber: "12312312",
        address: "1231312",
        provinceId: provinces.id,
        cityId: regencies.id,
        idNumber: hashedKTP
      },
    });

    // Tambahkan role SuperAdmin ke user
    await prisma.userRoles.create({
      data: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    });

    console.log('SuperAdmin user created successfully!');
  } catch (error) {
    console.error('Error creating SuperAdmin user:', error);
  } finally {
    prisma.$disconnect();
  }
}

async function main() {
 try{
  await prisma.secret.create({
    data:{
      clientId:"klhk-974f693f-9dcf-4b3a-b76e-eaee0da0c3a9",
      clientSecret:"56f3bd572037efc90b74b08f8eb3db8fa4fb28ed47270f87279613b529b225d1"
    }
  })

 }catch(error){

 }
 try{

  // Seed Location and other hierarchical models (Province, Regency, District, Village)
  await prisma.province.create({
    data: {
      id: '00',
      name: 'New York',
    },
  });

  await prisma.regencies.create({
    data: {
      id: '001',
      name: 'Manhattan',
      provinceId: '00',
    },
  });

  await prisma.districts.create({
    data: {
      id: '0011',
      name: 'Midtown',
      regencyId: '001',
    },
  });

  await prisma.village.create({
    data: {
      id: '00111',
      name: 'Village 1',
      districtId: '0011',
    },
  });

  }catch(error){
    console.log(error);
  }

  const provinces = await prisma.province.findMany();
  const regencies = await prisma.regencies.findMany();
  const districts = await prisma.districts.findMany();
  const villages = await prisma.village.findMany();
  await prisma.jenisSample.deleteMany();
  await prisma.jenisSampleType.deleteMany();
  await prisma.roles.deleteMany();

  await insertRoles(prisma)

  await createSuperAdminUser(prisma);

  // Seed Multiple DataBahanB3
  const dataBahanB3 = await prisma.dataBahanB3.createMany({
    data: [
      { casNumber: '7439-97-6', namaBahanKimia: 'Mercury', namaDagang: 'Quicksilver', tipeBahan: 'Toxic Metal' },
      { casNumber: '7440-02-0', namaBahanKimia: 'Nickel', namaDagang: 'Nickel Metal', tipeBahan: 'Metal' },
      { casNumber: '7440-22-4', namaBahanKimia: 'Silver', namaDagang: 'Argentum', tipeBahan: 'Metal' },
      { casNumber: '7440-66-6', namaBahanKimia: 'Zinc', namaDagang: 'Zinc Metal', tipeBahan: 'Metal' },
      { casNumber: '7440-61-1', namaBahanKimia: 'Uranium', namaDagang: 'Uraninite', tipeBahan: 'Radioactive Metal' },
      { casNumber: '7440-31-5', namaBahanKimia: 'Tin', namaDagang: 'Stannum', tipeBahan: 'Metal' },
      { casNumber: '7782-49-2', namaBahanKimia: 'Selenium', namaDagang: 'Selenium', tipeBahan: 'Non-metal' },
      { casNumber: '7440-36-0', namaBahanKimia: 'Antimony', namaDagang: 'Stibium', tipeBahan: 'Metalloid' },
      { casNumber: '7440-38-2', namaBahanKimia: 'Arsenic', namaDagang: 'Arsenic', tipeBahan: 'Metalloid' },
      { casNumber: '7440-50-8', namaBahanKimia: 'Copper', namaDagang: 'Cuprum', tipeBahan: 'Metal' },
    ],
    skipDuplicates: true,
  });

  // Seed Multiple DataPejabat
  const dataPejabat = await prisma.dataPejabat.createMany({
    data: [
      { nip: '1234567890', nama: 'Dr. John Doe', jabatan: 'Director of Environmental Safety', status: 'ACTIVE' },
      { nip: '2345678901', nama: 'Jane Smith', jabatan: 'Deputy Director', status: 'ACTIVE' },
      { nip: '3456789012', nama: 'Alice Johnson', jabatan: 'Chief of Compliance', status: 'INACTIVE' },
      { nip: '4567890123', nama: 'Bob Brown', jabatan: 'Head of Inspection', status: 'ACTIVE' },
      { nip: '5678901234', nama: 'Charlie Davis', jabatan: 'Head of Research', status: 'ACTIVE' },
      { nip: '6789012345', nama: 'Diana Evans', jabatan: 'Environmental Analyst', status: 'ACTIVE' },
      { nip: '7890123456', nama: 'Eve Foster', jabatan: 'Legal Advisor', status: 'ACTIVE' },
      { nip: '8901234567', nama: 'Frank Green', jabatan: 'Technical Lead', status: 'INACTIVE' },
      { nip: '9012345678', nama: 'Grace Harris', jabatan: 'Environmental Scientist', status: 'ACTIVE' },
      { nip: '0123456789', nama: 'Henry Irwin', jabatan: 'Chief Engineer', status: 'ACTIVE' },
    ],
    skipDuplicates: true,
  });

  // Seed Multiple DataTembusan
  const dataTembusan = await prisma.dataTembusan.createMany({
    data: [
      { nama: 'Ministry of Environmental Affairs', tipe: 'Government' },
      { nama: 'Ministry of Industry', tipe: 'Government' },
      { nama: 'Ministry of Health', tipe: 'Government' },
      { nama: 'Environmental Protection Agency', tipe: 'Government' },
      { nama: 'National Chemical Safety Board', tipe: 'Government' },
      { nama: 'Environmental NGO', tipe: 'NGO' },
      { nama: 'Greenpeace', tipe: 'NGO' },
      { nama: 'WWF', tipe: 'NGO' },
      { nama: 'Bureau of Industrial Safety', tipe: 'Government' },
      { nama: 'Department of Public Health', tipe: 'Government' },
    ],
    skipDuplicates: true,
  });

  // Seed User Roles
  await prisma.userRole.createMany({
    data: [
      { userId: 'user1', role: 'ADMIN', scope: '*' },
      { userId: 'user2', role: 'USER', scope: '*' },
    ],
  });

  // Seed Categories
  await prisma.category.createMany({
    data: [
      {
        name: 'News',
        slug: 'news',
        type: 'NEWS',
        author: 'admin',
        status: 'PUBLISHED',
      },
      {
        name: 'Article',
        slug: 'article',
        type: 'ARTICLE',
        author: 'admin',
        status: 'PUBLISHED',
      },
      {
        name: 'Info',
        slug: 'info',
        type: 'INFO',
        author: 'admin',
        status: 'PUBLISHED',
      },
      {
        name: 'Document',
        slug: 'document',
        type: 'DOCUMENT',
        author: 'admin',
        status: 'PUBLISHED',
      },
      {
        name: 'Event',
        slug: 'event',
        type: 'EVENT',
        author: 'admin',
        status: 'PUBLISHED',
      },
      {
        name: 'Attachment',
        slug: 'attachment',
        type: 'ATTACHMENT',
        author: 'admin',
        status: 'PUBLISHED',
      },
    ],
    skipDuplicates: true,
  });

   // Seed News
   const newsTitle = 'AI Technology Advancements';
   const newsSlug = generateUniqueSlug(newsTitle);

   await prisma.news.create({
     data: {
       title: newsTitle,
       slug: newsSlug, // Ensure unique slug
       content: 'This article discusses the latest in AI technology...',
       description: 'A detailed exploration of AI advancements',
       views: 100,
       author: 'user1',
       status: 'PUBLISHED',
       createdById: 'user1',
       categories: { connect: [{ slug: 'news' }] }, // Connect by id
     },
   });

   // Seed Articles
   const articleTitle = 'The Future of Quantum Computing';
   const articleSlug = generateUniqueSlug(articleTitle);

   await prisma.article.create({
     data: {
       title: articleTitle,
       slug: articleSlug,
       content: 'Quantum computing is revolutionizing...',
       description: 'An article on quantum computing breakthroughs',
       views: 200,
       author: 'user2',
       status: 'PUBLISHED',
       createdById: 'user2',
       categories: { connect: [{ slug: 'article'}] }, // Connect by id
     },
   });


   // Seed Info
   const infoTitle = 'Climate Change Impact';
   const infoSlug = generateUniqueSlug(infoTitle);

   await prisma.info.create({
     data: {
       title: infoTitle,
       slug: infoSlug,
       description: 'A report on the impact of climate change...',
       views: 150,
       author: 'user1',
       status: 'DRAFT',
       createdById: 'user1',
       categories: { connect: [{ slug: 'info' }] }, // Connect by id
     },
   });

   // Seed Events
   const eventTitle = 'Global Environmental Summit';
   const eventSlug = generateUniqueSlug(eventTitle);

   await prisma.event.create({
     data: {
       title: eventTitle,
       slug: eventSlug,
       description: 'A summit focusing on global environmental issues...',
       startDate: new Date('2024-12-01T10:00:00Z'),
       endDate: new Date('2024-12-02T18:00:00Z'),
       latitude: 40.7128,
       longitude: -74.0060,
       city: 'New York',
       province: 'NY',
       country: 'USA',
       author: 'user1',
       createdById: 'user1',
       status: 'PUBLISHED',
       categories: { connect: [{ slug: 'event' }] }, // Connect by id
     },
   });

  // Seed Photos
  await prisma.photo.create({
    data: {
      url: 'https://example.com/photo.jpg',
      author: 'user1',
      status: 'PUBLISHED',
    },
  });
  let jenisSampleType;
  let jenisSample;

  const jenisSampleTypes = [
    { type: 'JNS_01', deskripsi: 'Tanah' },
    { type: 'JNS_02', deskripsi: 'Air Permukaan' },
    { type: 'JNS_03', deskripsi: 'Air Bersih' },
    { type: 'JNS_04', deskripsi: 'Sedimen' },
    { type: 'JNS_05', deskripsi: 'Udara' },
    { type: 'JNS_06', deskripsi: 'Biota' },
    { type: 'JNS_07', deskripsi: 'Padi' },
    { type: 'JNS_08', deskripsi: 'Tanaman Lainnya' },
  ];

  try {
    // Loop untuk memasukkan data jenisSampleTypes
    for (const sampleType of jenisSampleTypes) {
      try {
        // Seed JenisSampleType
        jenisSampleType = await prisma.jenisSampleType.upsert({
          where: { type: sampleType.type },
          update: {},
          create: {
            type: sampleType.type,
            deskripsi: sampleType.deskripsi,
          },
        });
        console.log(`Inserted or updated: ${sampleType.type} - ${sampleType.deskripsi}`);
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.error(`Duplicate entry for type ${sampleType.type}. Skipping...`);
        } else {
          console.error(`Error processing ${sampleType.type}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error('An error occurred during seeding:', error);
  }

  const jenisSamples = [
    { jenis: 'Air & sedimen', type: 'JNS_02' },
    { jenis: 'Air Bersih', type: 'JNS_03' },
    { jenis: 'Air dan sedimen', type: 'JNS_02' },
    { jenis: 'Air Gelondong', type: 'JNS_02' },
    { jenis: 'Air limbah', type: 'JNS_02' },
    { jenis: 'Air Minum', type: 'JNS_03' },
    { jenis: 'Air Muara', type: 'JNS_02' },
    { jenis: 'Air Permukaan', type: 'JNS_02' },
    { jenis: 'Air Sumur', type: 'JNS_02' },
    { jenis: 'Air sumur dan tanaman', type: 'JNS_02' },
    { jenis: 'Air Sungai', type: 'JNS_02' },
    { jenis: 'Air Tong', type: 'JNS_02' },
    { jenis: 'Akar Kacang', type: 'JNS_08' },
    { jenis: 'Akar Padi', type: 'JNS_07' },
    { jenis: 'Bekas lahan pengolahan', type: 'JNS_01' },
    { jenis: 'Benthos', type: 'JNS_06' },
    { jenis: 'Beras', type: 'JNS_08' },
    { jenis: 'Bulir Padi', type: 'JNS_07' },
    { jenis: 'Daun', type: 'JNS_08' },
    { jenis: 'Daun Kacang', type: 'JNS_08' },
    { jenis: 'Daun Singkong', type: 'JNS_08' },
    { jenis: 'Limbah', type: 'JNS_04' },
    { jenis: 'Limbah dan air sumur', type: 'JNS_04' },
    { jenis: 'Limbah Padat', type: 'JNS_04' },
    { jenis: 'Limbah tailing dan sedimen', type: 'JNS_04' },
    { jenis: 'N/A', type: 'JNS_08' },
    { jenis: 'Organisme', type: 'JNS_06' },
    { jenis: 'Rumput & air', type: 'JNS_08' },
    { jenis: 'Sedimen', type: 'JNS_04' },
    { jenis: 'Sedimen dan air', type: 'JNS_04' },
    { jenis: 'Sedimen Tailing', type: 'JNS_04' },
    { jenis: 'Singkong', type: 'JNS_08' },
    { jenis: 'Tanah', type: 'JNS_01' },
    { jenis: 'Tanah dan tanaman', type: 'JNS_01' },
    { jenis: 'Tanah Kacang', type: 'JNS_01' },
    { jenis: 'Tanah Padi', type: 'JNS_01' },
    { jenis: 'Tanah singkong', type: 'JNS_01' },
    { jenis: 'Tanaman', type: 'JNS_08' },
    { jenis: 'Tanaman & air', type: 'JNS_08' },
    { jenis: 'Tanaman Pangan', type: 'JNS_08' },
    { jenis: 'Tanaman, air & sedimen', type: 'JNS_08' },
    { jenis: 'Udara', type: 'JNS_05' },
    { jenis: 'Udara Ambien / Partikel', type: 'JNS_05' },
    { jenis: 'Udara Ambien / Uap', type: 'JNS_05' },
    { jenis: 'Udara Ambien/Uap', type: 'JNS_05' },
  ];

  try {
    for (const sample of jenisSamples) {
      // Ambil typeId berdasarkan type
      const jenisSampleType = await prisma.jenisSampleType.findUnique({
        where: { type: sample.type },
      });

      if (!jenisSampleType) {
        console.error(`JenisSampleType ${sample.type} tidak ditemukan.`);
        continue;
      }
      
      // Ambil kode terakhir untuk jenis sample yang sesuai
      const lastSample = await prisma.jenisSample.findFirst({
        where: { typeId: jenisSampleType.id },
        orderBy: { code: 'desc' },
      });

      // Hitung kode berikutnya
      let nextCodeNumber = 1;
      if (lastSample) {
        const lastCode = lastSample.code.split('_').pop();
        if (lastCode) {
          nextCodeNumber = parseInt(lastCode) + 1;
        }
      }
      const nextCode = `${sample.type}_${String(nextCodeNumber).padStart(3, '0')}`;

      await prisma.jenisSample.create({
        data: {
          code: nextCode,
          jenisSampelType: { connect: { id: jenisSampleType.id } },
          deskripsi: sample.jenis,
          typeId: await prisma.jenisSampleType.findUnique({ where: { type: sample.type } }).then((t) => t?.id),
        },
      });
      console.log(`Inserted: ${sample.jenis} as type ${sample.type} ${nextCode}`);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }

  const jenisample = await prisma.jenisSample.findMany();

  // Seed MercuryMonitoring with relation to JenisSample and Location
  await prisma.mercuryMonitoring.create({
    data: {
      tahunPengambilan: new Date('2023-01-01'),
      hasilKadar: '0.05',
      satuan: 'mg/L',
      tingkatKadar: 'Below Threshold',
      konsentrasi: 'Low',
      jenisSampel: { connect: { id: getRandomPejabat(jenisample) } },
      photos: {
        create: [
          {
            url: 'https://example.com/photo.jpg',
            author: 'user1',
            status: 'PUBLISHED',
          },
        ],
      },
      location: {
        create: {
          latitude: 40.7128,
          longitude: -74.0060,
          description: 'Location in New York City',
        },
      }
    },
  });

  // Seed Search Metric
  await prisma.searchMetric.create({
    data: {
      userId: 'user1',
      keyword: 'environmental impact',
      categoryName: ['Science', 'Technology'],
      type: 'NEWS',
      timestamp: new Date(),
    },
  });

  // Seed Content View Log
  await prisma.contentViewLog.create({
    data: {
      contentId: 'news1',
      contentType: 'news',
      viewedAt: new Date(),
    },
  });

  
  await prisma.location.create({
    data: {
      latitude: 40.7128,
      longitude: -74.0060,
      description: 'Location in New York City',
      province: { connect: { id: getRandomPejabat(provinces) } },
      regency: { connect: { id: getRandomPejabat(regencies) } },
      district: { connect: { id: getRandomPejabat(districts) } },
      village: { connect: { id: getRandomPejabat(villages) } },
    },
  });
  try{
    const company = await prisma.company.create({
      data: {
        name: 'TechCorp',
        penanggungJawab: 'John Doe',
        alamatKantor: '123 Tech Street',
        telpKantor: '1234567890',
        faxKantor: '0987654321',
        emailKantor: 'contact@techcorp.com',
        npwp: '1234567890123451',
        nomorInduk: '567891',
        kodeDBKlh: 'DB1231',
        alamatPool: ['Pool 1', 'Pool 2'],
        bidangUsaha: 'Technology',
      },
    });


  }
  catch(error){

  }
  // Seed Company
  const companies = await prisma.company.findMany();
  const company = companies[0];
  try{
    // Seed Vehicle
  const vehicle1 = await prisma.vehicle.create({
    data: {
      noPolisi: '123XYZ2',
      modelKendaraan: 'Model S',
      tahunPembuatan: 2020,
      nomorRangka: 'ABC1234',
      nomorMesin: 'XYZ7891',
      kepemilikan: 'Owned',
      company: { connect: { id: company.id } }, // Connect to the company
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      noPolisi: '456ABCD',
      modelKendaraan: 'Model X',
      tahunPembuatan: 2021,
      nomorRangka: 'DEF4563',
      nomorMesin: 'UVW1232',
      kepemilikan: 'Owned',
      company: { connect: { id: company.id } }, // Connect to the company
    },

  });

  // Seed IdentitasApplication
  const identitasApplication = await prisma.identitasApplication.create({
    data: {
      namaPemohon: 'Jane Doe',
      jabatan: 'Manager',
      alamatDomisili: '456 Manager Lane',
      teleponFax: '0987654321',
      email: 'jane.doe@techcorp.com',
      npwp: '987654321098765',
      company: { connect: { id: company.id } }, // Connect to the company
    },
  });



  // Seed Application
  const application = await prisma.application.create({
    data: {
      kodePermohonan: 'APP1243',
      status: 'PENDING',
      jenisPermohonan: 'Import',
      tipeSurat: 'Surat A',
      tanggalPengajuan: new Date(),
      company: { connect: { id: company.id } }, // Connect to the company
      identitasPemohon: { connect: { id: identitasApplication.id } }, // Connect to the IdentitasApplication
      requiredDocumentsStatus: {}, // JSON field
    },
  });

  }
  catch(error){

  }
// Fetch vehicles for the specific company
const vehicles = await prisma.vehicle.findMany({
  where: {
    companyId: company.id, // Filter by the companyId
  },
});

  // Fetch applications for the specific company
  const applications = await prisma.application.findMany({
    where: {
      companyId: company.id, // Filter by the companyId
    },
  });
  const application = applications[0];
  // Seed ApplicationOnVehicle (Many-to-many relationship between Application and Vehicles)
  try{
    await prisma.applicationOnVehicle.createMany({
      data: [
        {
          applicationId: application.id, // Link the application
          vehicleId: getRandomPejabat(vehicles),// Link vehicle 1
        },
        {
          applicationId: application.id, // Link the same application
          vehicleId: getRandomPejabat(vehicles), // Link vehicle 2
        },
      ],
    });
  }catch(error){
  }

  try{
         // Seed `DocumentRekomendasiB3` for each document type
         const documentData = [
          { fileName: 'akte_perusahaan.pdf', documentType: TipeDokumen.AKTE_PERUSAHAAN, fileUrl: 'https://example.com/akte_perusahaan.pdf' },
          { fileName: 'pengesahan_akta_perusahaan.pdf', documentType: TipeDokumen.PENGESAHAN_AKTA_PERUSAHAAN, fileUrl: 'https://example.com/pengesahan_akta_perusahaan.pdf' },
          { fileName: 'sds_or_ldk.pdf', documentType: TipeDokumen.MSDS_LDK_B3, fileUrl: 'https://example.com/sds_or_ldk.pdf' },
          { fileName: 'bukti_kepemilikan_alat_angkut.pdf', documentType: TipeDokumen.BUKTI_KEPEMILIKAN_ALAT_ANGKUT, fileUrl: 'https://example.com/bukti_kepemilikan_alat_angkut.pdf' },
          { fileName: 'sop_bongkar_muat.pdf', documentType: TipeDokumen.SOP_BONGKAR_MUAT, fileUrl: 'https://example.com/sop_bongkar_muat.pdf' },
          { fileName: 'sop_tanggap_darurat.pdf', documentType: TipeDokumen.SOP_TANGGAP_DARURAT, fileUrl: 'https://example.com/sop_tanggap_darurat.pdf' },
          { fileName: 'foto_kendaraan.jpg', documentType: TipeDokumen.FOTO_KENDARAAN, fileUrl: 'https://example.com/foto_kendaraan.jpg' },
          { fileName: 'foto_sop.jpg', documentType: TipeDokumen.FOTO_SOP_BONGKAR_MUAT_DARURAT_SDS, fileUrl: 'https://example.com/foto_sop.jpg' },
          { fileName: 'foto_kegiatan_bongkar_muat.jpg', documentType: TipeDokumen.FOTO_KEGIATAN_BONGKAR_MUAT, fileUrl: 'https://example.com/foto_kegiatan_bongkar_muat.jpg' },
          { fileName: 'foto_kemasan_b3.jpg', documentType: TipeDokumen.FOTO_KEMASAN_B3, fileUrl: 'https://example.com/foto_kemasan_b3.jpg' },
          { fileName: 'foto_alat_apd_tanggap_darurat.jpg', documentType: TipeDokumen.FOTO_ALAT_APD_TANGGAP_DARURAT, fileUrl: 'https://example.com/foto_alat_apd_tanggap_darurat.jpg' },
          { fileName: 'bukti_pelatihan_b3.pdf', documentType: TipeDokumen.BUKTI_PELATIHAN_B3, fileUrl: 'https://example.com/bukti_pelatihan_b3.pdf' },
          { fileName: 'hasil_pengujian_tangki_ukur.pdf', documentType: TipeDokumen.TANGKI_UKUR_MOBIL, fileUrl: 'https://example.com/hasil_pengujian_tangki_ukur.pdf' },
          { fileName: 'bejana_tekan.pdf', documentType: TipeDokumen.BEJANA_TEKAN, fileUrl: 'https://example.com/bejana_tekan.pdf' },
          { fileName: 'ip_prekursor.pdf', documentType: TipeDokumen.IP_PREKURSOR, fileUrl: 'https://example.com/ip_prekursor.pdf' },
          { fileName: 'alat_komunikasi.pdf', documentType: TipeDokumen.INFORMASI_ALAT_KOMUNIKASI, fileUrl: 'https://example.com/alat_komunikasi.pdf' },
          { fileName: 'surat_rekomendasi_sebelumnya.pdf', documentType: TipeDokumen.SURAT_REKOMENDASI_SEBELUMNYA, fileUrl: 'https://example.com/surat_rekomendasi_sebelumnya.pdf' },
          { fileName: 'sk_dirjen_perhubungan_darat.pdf', documentType: TipeDokumen.IZIN_PENGANGKUTAN_B3_SEBELUMNYA, fileUrl: 'https://example.com/sk_dirjen_perhubungan_darat.pdf' }
        ];
  // Iterate over each document entry and seed it into the database
  for (const document of documentData) {
    await prisma.documentRekomendasiB3.create({
      data: {
        fileName: document.fileName,
        documentType: document.documentType,
        fileUrl: document.fileUrl,
        applicationId: application.id, // Ensure the Application ID is valid
        isValid: false,
        validationNotes: 'Auto-validation',
      },
    });
  }

  }catch(error){
  }

  // Fetch all Pejabat and Tembusan
  const allPejabat = await prisma.dataPejabat.findMany();
  const allTembusan = await prisma.dataTembusan.findMany();
  const allDataBahanB3 = await prisma.dataBahanB3.findMany();

  // Seed B3Substance and related multiple LocationDetails
  const b3Substance = await prisma.b3Substance.create({
    data: {
      dataBahanB3:  { connect: { id: getRandomPejabat(allDataBahanB3) } }, // Random Pejabat
      b3pp74: true,
      b3DiluarList: false,
      karakteristikB3: 'Corrosive',
      fasaB3: 'Liquid',
      jenisKemasan: 'Steel Drum',
      tujuanPenggunaan: 'PH control for industrial wastewater',
      application: { connect: { id: application.id } }, // Connect to the Application

      // Seed Multiple AsalMuat Locations
      asalMuatLocations: {
        create: [
          {
            name: 'PT Sulfindo Adi Usaha',
            alamat: 'Jl. Raya Merak KM 117, Banten, Indonesia',
            latitude: -6.0247,
            longitude: 106.0157,

            locationType: 'asalMuat',
          },
          {
            name: 'PT Kimia Indonesia',
            alamat: 'Jl. Kimia Raya No. 22, Jakarta, Indonesia',
            latitude: -6.1751,
            longitude: 106.8650,
            locationType: 'asalMuat',
          },
          {
            name: 'PT Petrokimia',
            alamat: 'Jl. Gresik, Jawa Timur, Indonesia',
            latitude: -7.1553,
            longitude: 112.6558,
            locationType: 'asalMuat',
          },
          {
            name: 'PT Industri Kimia',
            alamat: 'Jl. Industri No. 45, Surabaya, Indonesia',
            latitude: -7.2575,
            longitude: 112.7521,
            locationType: 'asalMuat',
          },
        ],
      },

      // Seed Multiple TujuanBongkar Locations
      tujuanBongkarLocations: {
        create: [
          {
            name: 'PT Brataco Chemical Lampung',
            alamat: 'Jl. Soekarno Hatta KM 5, Lampung, Indonesia',
            latitude: -5.4296,
            longitude: 105.2615,
            locationType: 'tujuanBongkar',
          },
          {
            name: 'PT ABC Chemicals',
            alamat: 'Jl. Pabrik Kimia No. 10, Medan, Indonesia',
            latitude: 3.5952,
            longitude: 98.6722,
            locationType: 'tujuanBongkar',
          },
          {
            name: 'PT XYZ Chemicals',
            alamat: 'Jl. Industri No. 15, Semarang, Indonesia',
            latitude: -6.9667,
            longitude: 110.4167,
            locationType: 'tujuanBongkar',
          },
          {
            name: 'PT PQR Chemicals',
            alamat: 'Jl. Raya Industri, Makassar, Indonesia',
            latitude: -5.1354,
            longitude: 119.4238,
            locationType: 'tujuanBongkar',
          },
        ],
      },
    },
  });

  // Seed ApplicationStatusHistory
  await prisma.applicationStatusHistory.create({
    data: {
      application: { connect: { id: application.id } }, // Connect to the Application
      oldStatus: 'DRAFT',
      newStatus: 'PENDING',
      changedAt: new Date(),
      changedBy: 'admin',
    },
    });

  // Seed Notifikasi
  const notifikasi = await prisma.notifikasi.create({
    data: {
      company: { connect: { name: 'TechCorp' } },
      status: 'RECEIVED',
      notes: 'Initial submission received',
      tanggalDiterima: new Date(),
      referenceNumber: 'EU12345',
      negaraAsal: 'Germany',
    },
  });

  // Seed NotifikasiStatusHistory
  try{
    await prisma.notifikasiStatusHistory.create({
      data: {
        notifikasiId: notifikasi.id,
        oldStatus: 'RECEIVED',
        newStatus: 'PROCESSED',
        tanggalPerubahan: new Date(),
        changedBy: 'admin',
        notes: 'Processing started',
      },
    });
  }catch{

  }


  // Seed DraftSurat
  const draftSurat = await prisma.draftSurat.create({
    data: {
      nomorSurat: 'DS-001',
      tanggalSurat: new Date(),
      tipeSurat: 'Kebenaran Import',
      kodeDBKlh: 'KLH-001',
      pejabatId: getRandomPejabat(allPejabat), // Random Pejabat
      applicationId: application.id,
    },
  });

  // Seed FinalSurat
  const finalSurat = await prisma.finalSurat.create({
    data: {
      nomorSurat: 'FS-001',
      tanggalSurat: new Date(),
      pejabatId: getRandomPejabat(allPejabat), // Random Pejabat
      applicationId: application.id,
      signedByDirector: true,
      signatureUrl: 'https://example.com/signature.png',
      tembusan: {connect: getRandomTembusan(allTembusan, 3)}, // Multiple Tembusan
    },
  });

  // Seed BaseSuratNotifikasi
  const baseSurat = await prisma.baseSuratNotfikasi.create({
    data: {
      nomorSurat: 'BS-001',
      tanggalSurat: new Date(),
      tipeSurat: 'Kebenaran Import',
      pejabatId: getRandomPejabat(allPejabat), // Random Pejabat
      notifikasiId: notifikasi.id
    },
  });

  // Seed PersetujuanImport
  await prisma.persetujuanImport.create({
    data: {
      baseSuratId: baseSurat.id, // Foreign key to BaseSuratNotifikasi
      validitasSurat: new Date(),
      point1: 'Approved for import',
    },
  });

  // Seed KebenaranImport
  await prisma.kebenaranImport.create({
    data: {
      baseSuratId: baseSurat.id, // Foreign key to BaseSuratNotifikasi
      tanggalMaksimalPengiriman: new Date('2024-12-31'),
      point1: 'Approved for shipment',
    },
  });

  // Seed ExplicitConsent
  const explicitConsent = await prisma.explicitConsent.create({
    data: {
      baseSuratId: baseSurat.id, // Foreign key to BaseSuratNotifikasi
      validitasSurat: new Date(),
      jenisExplicitConsent: 'Non Echa',
      namaExporter: 'Exporter GmbH',
      tujuanImport: 'PT Importer',
    },
  });

  // Seed PDFHeader
  const pdfHeader = await prisma.pDFHeader.create({
    data: {
      header: 'Ministry of Environment',
      subHeader: 'Environmental Protection Agency',
      alamatHeader: '123 Green Street, City, Country',
      telp: '1234567890',
      fax: '0987654321',
      kotakPos: 'PO Box 123',
    },
  });

  // Seed ExplicitConsentDetails with all sections
  await prisma.explicitConsentDetails.create({
    data: {
      explicitConsentId: explicitConsent.id, // Foreign key to ExplicitConsent

      // Section 1A - Chemical Identity (Substance)
      nameOfChemicalSubstance: 'Mercury',
      casNumberSubstance: '7439-97-6',

      // Section 1B - Chemical Identity (Preparation)
      nameOfPreparation: 'Mercury Solution',
      nameOfChemicalInPreparation: 'Mercury',
      concentrationInPreparation: '20%',
      casNumberPreparation: '7439-97-6',

      // Section 2 - Response to the Request for Explicit Consent
      consentToImport: true,

      // Section 3 - Use Categories
      useCategoryPesticide: false,
      useCategoryIndustrial: true,

      // Section 4 - Wider Consent for Preparations
      consentForOtherPreparations: true,
      allowedConcentrations: '20%',
      consentForPureSubstance: true,

      // Section 5 - Restrictions/Conditions
      hasRestrictions: true,
      restrictionDetails: 'Restricted to industrial use only',

      // Section 6 - Time Limit
      isTimeLimited: true,
      timeLimitDetails: new Date('2025-12-31'),

      // Section 7 - Same Treatment for Domestic and Imported Chemicals
      sameTreatment: false,
      differentTreatmentDetails: 'Imported chemicals require additional checks',

      // Section 8 - Any Other Relevant Information
      otherRelevantInformation: 'Handle with care due to high toxicity.',

      // Section 9 - Name and Address of Importing DNA
      dnaInstitutionName: 'Department of Environmental Protection',
      dnaInstitutionAddress: '123 Green Street, City, Country',
      dnaContactName: 'Dr. John Doe',
      dnaTelephone: '1234567890',
      dnaTelefax: '0987654321',
      dnaEmail: ['contact@dep.gov'],
      dnaDate: new Date(),
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
