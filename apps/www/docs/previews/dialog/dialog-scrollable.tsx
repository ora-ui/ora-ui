'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/ui/dialog';
import { Button } from '@/registry/ui/button';

const RELEASE_NOTES = [
  {
    version: '3.2.0',
    date: 'May 2025',
    changes: [
      'Added collaborative playlist editing with real-time sync',
      'New crossfade controls in playback settings',
      'Improved search with genre and mood filters',
    ],
  },
  {
    version: '3.1.0',
    date: 'March 2025',
    changes: [
      'Introduced the Queue sidebar for drag-and-drop reordering',
      'Sleep timer now supports custom durations',
      'Library now shows recently played artists',
    ],
  },
  {
    version: '3.0.0',
    date: 'January 2025',
    changes: [
      'Redesigned player with full lyrics support',
      'Offline mode for downloaded tracks',
      'New equalizer presets: Bass Boost, Vocal Clarity, Studio Flat',
    ],
  },
  {
    version: '2.9.0',
    date: 'November 2024',
    changes: [
      'Radio stations now generated from any track or artist',
      'Social sharing for playlists',
      'Performance improvements across the board',
    ],
  },
  {
    version: '2.8.0',
    date: 'September 2024',
    changes: [
      'Canvas view for building playlists visually',
      'Smart recommendations based on listening history',
      'Improved dark mode contrast throughout',
    ],
  },
  {
    version: '2.7.0',
    date: 'July 2024',
    changes: [
      'Mini player now persists across all pages',
      'Added support for lossless audio formats',
      'Playlist covers can now use a track artwork collage',
    ],
  },
];

export default function DialogScrollable() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Release notes</Button>} />
      <DialogContent className="flex max-h-[80vh] flex-col gap-0">
        <DialogHeader>
          <DialogTitle>Release notes</DialogTitle>
          <DialogDescription>{"What's new in the latest versions of the app."}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            {RELEASE_NOTES.map(({ version, date, changes }) => (
              <div key={version} className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-primary">v{version}</span>
                  <span className="text-xs text-muted">{date}</span>
                </div>
                <ul className="flex flex-col gap-1">
                  {changes.map((change) => (
                    <li key={change} className="flex gap-2 text-sm text-secondary">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
