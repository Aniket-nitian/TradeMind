import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrategiesTab } from "@/features/strategies/components/StrategiesTab";
import { TagsTab } from "@/features/tags/components/TagsTab";
import { MistakesTab } from "@/features/mistakes/components/MistakesTab";

export default function CatalogPage() {
  return (
    <div>
      <PageHeader
        title="Catalog"
        description="Manage the strategies, tags, and mistakes you use to label your trades."
      />

      <Tabs defaultValue="strategies">
        <TabsList>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <StrategiesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <TagsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mistakes" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <MistakesTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
