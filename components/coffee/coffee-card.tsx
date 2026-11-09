import { Coffee } from "@/server/models/coffee";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";

export default function CoffeeCard({ coffee }: { coffee: Coffee }) {
  return (
    <Card className="w-[280px] h-[456px] pt-0 rounded-t-xl gap-0 hover:cursor-pointer transition-all hover:scale-105">
      <CardHeader className="p-0 relative">
        <Image
          className="rounded-t-xl h-[300px] object-cover"
          src={coffee.imageUrl}
          width={280}
          height={300}
          alt={coffee.name}
        />
        {coffee.label && (
          <Badge className="absolute top-3 right-3">{coffee.label}</Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col text-left pt-3 gap-2">
        <p className="font-semibold">{coffee.name}</p>
        <p className="text-muted-foreground w-full line-clamp-2">
          {coffee.description}
        </p>
        <p>${coffee.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
