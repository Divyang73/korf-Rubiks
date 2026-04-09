from pydantic import BaseModel, Field


class CubeState(BaseModel):
    value: str = Field(..., min_length=54, max_length=54)
