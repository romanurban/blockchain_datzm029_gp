import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ImageCardProps {
  imageUrl: string;
  altText: string;
}

export function ImageCard({ imageUrl, altText }: ImageCardProps) {
  return (
    <Card>
      <CardContent>
        <Image src={imageUrl} alt={altText} width={500} height={300} />
      </CardContent>
    </Card>
  );
}