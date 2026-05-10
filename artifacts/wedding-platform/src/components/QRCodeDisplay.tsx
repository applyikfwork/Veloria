import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./ui/button";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  fileName?: string;
  coupleNames?: string;
}

export default function QRCodeDisplay({ 
  value, 
  size = 200, 
  fileName = "wedding-rsvp-qr",
  coupleNames 
}: QRCodeDisplayProps) {
  const { toast } = useToast();
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = size + 40;
      canvas.height = size + 40;
      if (ctx) {
        // Background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw QR
        ctx.drawImage(img, 20, 20);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${fileName}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        
        toast({
          title: "Downloaded!",
          description: "Your RSVP QR code has been saved.",
        });
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wedding RSVP QR Code',
          text: `Here is my RSVP QR code for ${coupleNames || 'the'} wedding.`,
          url: window.location.href
        });
      } catch (err) {
        // Ignore abort errors
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Share this link with others to show your RSVP status.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl shadow-xl">
      <div className="p-4 bg-white border-8 border-primary/10 rounded-xl">
        <QRCodeSVG
          ref={svgRef}
          value={value}
          size={size}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: "/favicon.svg",
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>
      
      <div className="flex gap-4 w-full">
        <Button 
          onClick={downloadQR}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-download-qr"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button 
          variant="outline"
          onClick={shareQR}
          className="flex-1 border-primary/20 text-primary hover:bg-primary/5"
          data-testid="button-share-qr"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
