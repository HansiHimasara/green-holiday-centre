import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function UITestPage() {
  return (
    <main className="min-h-screen bg-[var(--surface)] px-6 py-12">
      <div className="mx-auto max-w-[1000px]">
        {/* Page Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[var(--green-dark)]">
            UI Component Test Page
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Testing reusable Green Holiday UI components.
          </p>
        </div>

        <div className="space-y-10">

          {/* Buttons */}
          <Card>
            <h2 className="mb-6 text-2xl">
              Buttons
            </h2>

            <div className="flex flex-wrap gap-4">
              <Button>
                Primary Button
              </Button>

              <Button variant="outline">
                Outline Button
              </Button>

              <Button href="/admin/login">
                Login Page
              </Button>
            </div>
          </Card>

          {/* Input Fields */}
          <Card>
            <h2 className="mb-6 text-2xl">
              Input Fields
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g., Sarah Jenkins"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="e.g., sarah@example.com"
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+94 77 123 4567"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
              />
            </div>
          </Card>

          {/* Select Fields */}
          <Card>
            <h2 className="mb-6 text-2xl">
              Select Fields
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Select
                label="Vehicle Type"
                placeholder="Select Vehicle"
                options={[
                  {
                    label: "Premium Sedan",
                    value: "premium-sedan",
                  },
                  {
                    label: "Luxury SUV",
                    value: "luxury-suv",
                  },
                  {
                    label: "Executive Minivan",
                    value: "executive-minivan",
                  },
                ]}
              />

              <Select
                label="Number of Passengers"
                placeholder="Select Passenger Count"
                options={[
                  {
                    label: "1 Passenger",
                    value: "1",
                  },
                  {
                    label: "2 Passengers",
                    value: "2",
                  },
                  {
                    label: "4 Passengers",
                    value: "4",
                  },
                  {
                    label: "6 Passengers",
                    value: "6",
                  },
                ]}
              />
            </div>
          </Card>

          {/* Textarea */}
          <Card>
            <h2 className="mb-6 text-2xl">
              Textarea
            </h2>

            <Textarea
              label="Special Requirements"
              placeholder="Enter your special requirements..."
            />
          </Card>

          {/* Badges */}
          <Card>
            <h2 className="mb-6 text-2xl">
              Badges
            </h2>

            <div className="flex flex-wrap gap-4">
              <Badge>
                Most Popular
              </Badge>

              <Badge variant="success">
                Paid & Confirmed
              </Badge>
            </div>
          </Card>

          {/* Combined Form Example */}
          <Card>
            <h2 className="mb-6 text-2xl">
              Combined Form Test
            </h2>

            <form className="space-y-6">
              <Input
                label="Customer Name"
                placeholder="Sarah Jenkins"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="sarah@example.com"
              />

              <Select
                label="Selected Vehicle"
                placeholder="Choose Vehicle"
                options={[
                  {
                    label: "Premium Sedan",
                    value: "sedan",
                  },
                  {
                    label: "Luxury SUV",
                    value: "suv",
                  },
                  {
                    label: "Executive Minivan",
                    value: "minivan",
                  },
                ]}
              />

              <Textarea
                label="Message"
                placeholder="Write your message..."
              />

              <div className="flex gap-4">
                <Button type="submit">
                  Submit Form
                </Button>

                <Button variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}