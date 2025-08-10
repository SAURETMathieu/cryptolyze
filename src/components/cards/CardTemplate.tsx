import { ReactElement } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

interface cardStyles {
  title?: string;
  card?: string;
  header?: string;
  description?: string;
  content?: string;
  footer?: string;
}

interface CardTemplateProps {
  title: ReactElement | string;
  description?: ReactElement | string;
  content?: ReactElement | string;
  footer?: ReactElement | string;
  styles?: cardStyles;
}

export function CardTemplate({
  styles = {},
  title,
  content,
  footer,
  description,
}: CardTemplateProps) {
  const {
    title: titleClass = "",
    card: cardClass = "",
    header: headerClass = "",
    description: descriptionClass = "",
    content: contentClass = "",
    footer: footerClass = "",
  } = styles;
  return (
    <Card className={cardClass}>
      <CardHeader className={headerClass}>
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
        {description && (
          <CardDescription className="max-w-lg text-balance text-sm leading-relaxed">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {content && <CardContent className={contentClass}>{content}</CardContent>}
      {footer && <CardFooter className={footerClass}>{footer}</CardFooter>}
    </Card>
  );
}
