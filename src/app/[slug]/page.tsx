import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { contentService } from "@/services/content.service";
import { getServerApi } from "@/utils/serverApi";
import { toPersianNumber } from "@/utils/persian";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const api = await getServerApi();

  try {
    const page = await contentService.getPage(slug, api);
    return {
      title: page.title,
      description: page.description?.substring(0, 160),
    };
  } catch {
    return {};
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const api = await getServerApi();

  try {
    const page = await contentService.getPage(slug, api);
    
    return (
      <Container sx={{ py: 4, maxWidth: "lg" }}>
        <Typography variant="h2" sx={{ mb: 3 }}>{toPersianNumber(page.title)}</Typography>
        <div 
          style={{ lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: toPersianNumber(page.description) }}
        />
      </Container>
    );
  } catch {
    notFound();
  }
}
