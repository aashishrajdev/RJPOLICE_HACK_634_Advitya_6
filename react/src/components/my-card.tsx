import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CardWithForm() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Add New Camera</CardTitle>
        <CardDescription>
          Add a new camera. You can add more cameras later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="Model of the camera" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="range">Range</Label>
              <Select>
                <SelectTrigger id="range">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="100m">100m</SelectItem>
                  <SelectItem value="200m">200m</SelectItem>
                  <SelectItem value="300m">300m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Save</Button>
      </CardFooter>
    </Card>
  );
}
