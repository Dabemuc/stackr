import CustomMdRenderer from "@/components/md/CustomMdRenderer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full flex flex-col items-center">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-accent-gradiant-to/90">
          About Stackr
        </h1>
        <CustomMdRenderer>{mainParagraph}</CustomMdRenderer>
      </div>
    </div>
  );
}

const mainParagraph = `# TLDR

Stackr is my personal knowledge base for every thing in IT.  
It’s a place to capture newly gained knowledge, while providing an interactive overview to make it easier to pick the right solution for the job at hand.  
Although you are welcome to use mine, you can [set up Stackr for yourself](https://github.com/Dabemuc/stackr) as well.
# The Problem

Imagine you are tasked with building a system from the ground up. Or maybe you are already managing a (maybe not so) well-oiled machine that needs some new gears, aftermarket parts, or special tuning.  

There are multiple ways to go forward. These are the ones I've seen so far:

1. Some will dive into endless research, comparing every option. Their search history still remembers the last time.
2. Others stick with the stuff they know, disregarding the new and shiny as just that.
3. Or maybe they remember that one cool service they heard of months ago that would be perfect for this? No they probably don't.

# The Solution

Stackr keeps me from researching the same things over and over again and prevents me from forgetting I already know the perfect tool. When I learn something new, I put it here. When I need something, I have a place to check that’s faster than Googling.

## Why not just a list?

This project started as a simple list. But the tech I deal with started to become more complex, which made the list impossible to manage. One platform might provide dozens of services, databases aim to replace entire backends and companies are actively working on dissolving the layers I just learned about in college.  
  
So Stackr aims to do what a list can't. It's a simple tool to tackle a complex topic.
`;
