from django import forms

class CVForm(forms.Form):
    cv_file = forms.FileField(label="Upload CV (PDF only)")
    job_description = forms.CharField(widget=forms.Textarea, label="Paste Job Description")
