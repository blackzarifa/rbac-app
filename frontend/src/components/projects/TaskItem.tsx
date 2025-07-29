'use client';

import { Task } from '@/services/task.service';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  canUpdate: boolean;
  canDelete: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, canUpdate, canDelete, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <button onClick={onToggle} disabled={!canUpdate} className="focus:outline-none">
          {task.completed ? (
            <CheckSquare className="h-5 w-5 text-primary" />
          ) : (
            <Square className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </span>
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}