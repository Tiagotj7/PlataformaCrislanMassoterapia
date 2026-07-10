import { db } from "./index";
import { users, services, settings, testimonials, gallery, clients, appointments } from "./schema";
import { eq } from "drizzle-orm";

export async function initializeDatabase() {
  // Check if admin user exists
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length === 0) {
    await db.insert(users).values({
      name: "Crislan Massoterapeuta",
      email: "admin@crislan.com",
      passwordHash: "senha123", // Plain text or simple hash for demo purposes
      role: "admin"
    });
  }

  // Check if settings exist
  const existingSettings = await db.select().from(settings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(settings).values({
      siteName: "Crislan Massoterapeuta",
      ownerName: "Crislan Massoterapeuta",
      whatsappNumber: "5511998877665",
      instagramHandle: "crislan.massoterapia",
      address: "Av. Pres. Juscelino Kubitschek, 1400 - Vila Olímpia, São Paulo - SP",
      googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.282834181934!2d-46.68749452331572!3d-23.594165561413808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5745dc7a0701%3A0x63cfbfd41d9c4901!2sAv.%20Pres.%20Juscelino%20Kubitschek%2C%201400%20-%20Vila%20Ol%C3%ADmpia%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004543-000!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr",
      businessHourStart: "08:00",
      businessHourEnd: "20:00",
      lunchHourStart: "12:00",
      lunchHourEnd: "13:30",
      sundaysOpen: false,
      autoMessageText: "Olá! Recebemos seu agendamento de massoterapia com sucesso. Para confirmar ou esclarecer qualquer dúvida, fique à vontade para me chamar. Pagamento realizado presencialmente (Pix, Cartão ou Dinheiro)."
    });
  }

  // Check if services exist
  const existingServices = await db.select().from(services).limit(1);
  if (existingServices.length === 0) {
    const defaultServices = [
      {
        title: "Massoterapia Desportiva",
        slug: "massoterapia-desportiva",
        description: "Focada em atletas e praticantes de atividade física. Auxilia na liberação de ácido lático, alivia fadiga muscular pós-treino e melhora a flexibilidade para prevenir lesões.",
        durationMinutes: 60,
        price: "180.00",
        image: "https://images.pexels.com/photos/27730453/pexels-photo-27730453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        category: "Desportiva",
        status: true,
        featured: true
      },
      {
        title: "Liberação Miofascial (IASTM)",
        slug: "liberacao-miofascial",
        description: "Técnica manual e instrumental para soltar a fáscia muscular. Desfaz pontos de gatilho (trigger points), restaura a mobilidade das articulações e elimina dores crônicas.",
        durationMinutes: 60,
        price: "190.00",
        image: "https://images.pexels.com/photos/27684617/pexels-photo-27684617.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        category: "Miofascial",
        status: true,
        featured: true
      },
      {
        title: "Ventosaterapia + Massagem",
        slug: "ventosaterapia-massagem",
        description: "Uso de ventosas que criam sucção na pele para aumentar a circulação sanguínea local e oxigenação tecidual, combinada com liberação manual profunda nas costas e ombros.",
        durationMinutes: 75,
        price: "220.00",
        image: "https://images.pexels.com/photos/37719558/pexels-photo-37719558.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        category: "Recuperação",
        status: true,
        featured: true
      },
      {
        title: "Massagem Relaxante e Terapêutica",
        slug: "massagem-relaxante",
        description: "Movimentos longos, contínuos e profundos com óleos essenciais de alta qualidade. Ideal para quem sofre de estresse intenso, insônia, enxaqueca ou tensão muscular diária.",
        durationMinutes: 60,
        price: "160.00",
        image: "https://images.pexels.com/photos/37719560/pexels-photo-37719560.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        category: "Terapêutica",
        status: true,
        featured: false
      },
      {
        title: "Combo Elite Recovery (Atleta)",
        slug: "combo-elite-recovery",
        description: "A experiência premium definitiva: Alongamento passivo assistido, Liberação Miofascial completa, Ventosaterapia estratégica e massagem desportiva final.",
        durationMinutes: 90,
        price: "270.00",
        image: "https://images.pexels.com/photos/27730468/pexels-photo-27730468.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        category: "Desportiva",
        status: true,
        featured: true
      }
    ];

    for (const item of defaultServices) {
      await db.insert(services).values(item);
    }
  }

  // Check if testimonials exist
  const existingTestimonials = await db.select().from(testimonials).limit(1);
  if (existingTestimonials.length === 0) {
    const sampleTestimonials = [
      {
        clientName: "Lucas Mota",
        roleOrSport: "Maratonista Profissional",
        content: "O Crislan salvou minha preparação para a São Silvestre! Minhas panturrilhas estavam travadas e a liberação miofascial dele me permitiu correr sem dores e bater meu RP.",
        rating: 5,
        active: true
      },
      {
        clientName: "Mariana Vasconcelos",
        roleOrSport: "CrossFit & LPO",
        content: "Atendimento impecável! Recomendo muito a ventosaterapia combinada com massagem desportiva. Meus ombros e lombar agradecem toda semana. Profissional super ético e pontual.",
        rating: 5,
        active: true
      },
      {
        clientName: "Bruno Alencar",
        roleOrSport: "Empresário / Ciclista",
        content: "Faço atendimento domiciliar com o Crislan há 6 meses. Chega com maca, toalhas higienizadas e óleos premium. É o melhor investimento que faço na minha saúde física e mental.",
        rating: 5,
        active: true
      }
    ];

    for (const item of sampleTestimonials) {
      await db.insert(testimonials).values(item);
    }
  }

  // Check if gallery exists
  const existingGallery = await db.select().from(gallery).limit(1);
  if (existingGallery.length === 0) {
    const sampleGallery = [
      {
        title: "Recuperação de Membros Inferiores",
        imageUrl: "https://images.pexels.com/photos/27730453/pexels-photo-27730453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        category: "Desportiva",
        active: true
      },
      {
        title: "Trabalho de Estabilidade Corporal",
        imageUrl: "https://images.pexels.com/photos/27684602/pexels-photo-27684602.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        category: "Alongamento",
        active: true
      },
      {
        title: "Liberação de Cintura Escapular",
        imageUrl: "https://images.pexels.com/photos/37719558/pexels-photo-37719558.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        category: "Miofascial",
        active: true
      },
      {
        title: "Atendimento em Estúdio Moderno",
        imageUrl: "https://images.pexels.com/photos/37719560/pexels-photo-37719560.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        category: "Estrutura",
        active: true
      }
    ];

    for (const item of sampleGallery) {
      await db.insert(gallery).values(item);
    }
  }

  // Check if clients and sample appointments exist for demo in dashboard
  const existingClients = await db.select().from(clients).limit(1);
  if (existingClients.length === 0) {
    const demoClient1 = await db.insert(clients).values({
      name: "Gabriel Santos",
      phone: "11988887777",
      email: "gabriel.santos@gmail.com",
      notes: "Contratura recorrente no trapézio direito. Prefere pressão forte.",
      appointmentsCount: 3
    }).returning();

    const demoClient2 = await db.insert(clients).values({
      name: "Camila Ribeiro",
      phone: "11977776666",
      email: "camila.run@hotmail.com",
      notes: "Atleta de Triathlon. Foco em posterior de coxa e panturrilhas.",
      appointmentsCount: 2
    }).returning();

    const allServices = await db.select().from(services);
    if (allServices.length > 0 && demoClient1.length > 0 && demoClient2.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate future and past dates
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + 1);
      const tomorrow = dateObj.toISOString().split('T')[0];

      await db.insert(appointments).values([
        {
          clientId: demoClient1[0].id,
          serviceId: allServices[0].id,
          appointmentDate: today,
          appointmentTime: "14:00",
          durationMinutes: allServices[0].durationMinutes,
          careType: "studio",
          clientName: demoClient1[0].name,
          clientPhone: demoClient1[0].phone,
          observations: "Recuperação após meia maratona",
          price: allServices[0].price,
          status: "confirmed"
        },
        {
          clientId: demoClient2[0].id,
          serviceId: allServices[1].id,
          appointmentDate: tomorrow,
          appointmentTime: "10:30",
          durationMinutes: allServices[1].durationMinutes,
          careType: "domiciliar",
          clientName: demoClient2[0].name,
          clientPhone: demoClient2[0].phone,
          observations: "Atendimento domiciliar - levar maca",
          price: allServices[1].price,
          status: "confirmed"
        }
      ]);
    }
  }
}
