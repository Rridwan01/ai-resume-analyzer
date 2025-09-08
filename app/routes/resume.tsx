import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  {
    title: "Resumind | Review",
  },
  {
    name: "description",
    content: "Detailed overview of your resume",
  },
];

export default function Resume() {
  const { auth, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error("No resume ID provided");
        }

        const resume = await kv.get(`resume:${id}`);
        if (!resume) {
          throw new Error("Resume not found");
        }

        const data = JSON.parse(resume);

        // Load PDF
        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) {
          throw new Error("Failed to load PDF file");
        }

        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(pdfUrl);

        // Load Image
        const imageBlob = await fs.read(data.imagePath);
        if (!imageBlob) {
          throw new Error("Failed to load image file");
        }

        const imgBlob = new Blob([imageBlob], { type: "image/png" });
        const imgUrl = URL.createObjectURL(imgBlob);
        setImageUrl(imgUrl);

        setFeedback(data.feedback);
      } catch (err) {
        console.error("Error loading resume:", err);
        setError(err instanceof Error ? err.message : "Failed to load resume");
      } finally {
        setIsLoading(false);
      }
    };

    loadResume().catch((error) => {
      console.error("Error loading resume:", error);
    });

    // Cleanup URLs on unmount
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, [id, fs, kv]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : imageUrl && resumeUrl ? (
            <div className="animate-in fade-in duration-100 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  title="Resume preview"
                  alt="Resume preview"
                  className="w-full h-full object-contain rounded-2xl"
                  onError={(e) => {
                    console.error("Image failed to load");
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                  }}
                />
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              No resume found
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img
              src="/images/resume-scan-2.gif"
              alt="scan resume"
              className="w-full"
            />
          )}
        </section>
      </div>
    </main>
  );
}
