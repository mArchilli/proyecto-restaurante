import { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs'

const menuData = {
  breakfast: [
    {
      title: "Morning Starters",
      items: [
        { name: "Avocado Toast", price: "$12", description: "Sourdough bread, smashed avocado, poached eggs, cherry tomatoes", dietary: ["V"] },
        { name: "Greek Yogurt Parfait", price: "$9", description: "Honey-drizzled Greek yogurt, granola, mixed berries", dietary: ["V", "GF"] },
      ]
    },
    {
      title: "Egg Specialties",
      items: [
        { name: "Classic Eggs Benedict", price: "$14", description: "English muffin, Canadian bacon, poached eggs, hollandaise sauce" },
        { name: "Vegetable Frittata", price: "$13", description: "Open-faced omelet with seasonal vegetables and goat cheese", dietary: ["V", "GF"] },
      ]
    }
  ],
  lunch: [
    {
      title: "Starters",
      items: [
        { name: "Caesar Salad", price: "$10", description: "Romaine lettuce, croutons, parmesan cheese, Caesar dressing" },
        { name: "Tomato Basil Soup", price: "$8", description: "Creamy tomato soup with fresh basil and croutons", dietary: ["V"] },
      ]
    },
    {
      title: "Main Courses",
      items: [
        { name: "Grilled Chicken Sandwich", price: "$15", description: "Herb-marinated chicken breast, avocado, bacon, lettuce, tomato, aioli" },
        { name: "Quinoa Buddha Bowl", price: "$14", description: "Mixed greens, quinoa, roasted vegetables, chickpeas, tahini dressing", dietary: ["V", "GF"] },
      ]
    }
  ],
  dinner: [
    {
      title: "Appetizers",
      items: [
        { name: "Seared Scallops", price: "$18", description: "Pan-seared scallops with cauliflower puree and bacon jam", dietary: ["GF"] },
        { name: "Caprese Salad", price: "$12", description: "Fresh mozzarella, heirloom tomatoes, basil, balsamic glaze", dietary: ["V", "GF"] },
      ]
    },
    {
      title: "Entrees",
      items: [
        { name: "Filet Mignon", price: "$34", description: "8oz grass-fed beef tenderloin, garlic mashed potatoes, grilled asparagus", dietary: ["GF"] },
        { name: "Grilled Salmon", price: "$28", description: "Atlantic salmon, lemon butter sauce, wild rice pilaf, sautéed spinach", dietary: ["GF"] },
        { name: "Mushroom Risotto", price: "$22", description: "Arborio rice, wild mushrooms, truffle oil, parmesan cheese", dietary: ["V", "GF"] },
      ]
    }
  ]
}

function MenuSection({ section }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
      <div className="grid gap-4">
        {section.items.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  {item.dietary && (
                    <div className="flex gap-1 mt-1">
                      {item.dietary.map((diet) => (
                        <span key={diet} className="text-xs px-1 bg-secondary text-secondary-foreground rounded">
                          {diet}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold bg-primary text-primary-foreground px-2 py-1 rounded">
                  {item.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Menu() {
  const [setActiveTab] = useState("breakfast")

  return (
    <section id="menu" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-center">Cononce nuestro menu</h2>
        <p className="text-muted-foreground text-center mb-8">
        Explora nuestro menú cuidadosamente seleccionado, con ingredientes de origen local y sabores innovadores.
        </p>
        
        <Tabs defaultValue="breakfast" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="breakfast">Bocadillos</TabsTrigger>
            <TabsTrigger value="lunch">Sandwiches y Tostadas</TabsTrigger>
            <TabsTrigger value="dinner">Especiales</TabsTrigger>
          </TabsList>
          {Object.entries(menuData).map(([mealTime, sections]) => (
            <TabsContent key={mealTime} value={mealTime}>
              {sections.map((section, index) => (
                <MenuSection key={index} section={section} />
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            V - Vegetarian | GF - Gluten-Free
          </p>
          <Button variant="outline">Download Full Menu (PDF)</Button>
        </div>
      </div>
    </section>
  )
}
